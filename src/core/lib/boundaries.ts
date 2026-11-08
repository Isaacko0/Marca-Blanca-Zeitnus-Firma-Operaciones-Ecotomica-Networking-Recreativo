/**
 * Boundaries — policy gateway anfibio inspirado en OpenBot (CopilotKit/openbot).
 *
 * Principio (de OpenBot gateway.ts): "una acción que no fue registrada no ocurrió,
 * porque no hay camino que actúe sin escribir la fila primero". Y de policy.ts:
 * deny > allow, policy ausente = denegar, regla rota = denegar (fail-closed).
 *
 * Diferencia con OpenBot: corre 100% en el cliente (store local), sin Postgres ni
 * servicio externo, porque HSCSG es SPA offline-first. Mismo PATRÓN de gobernanza,
 * distinto transporte.
 *
 * Subset de "CEL-like" seguro (sin cel-js, sin deps): expresiones atómicas
 *   <campo> <op> <valor>
 * unidas por && / || (sin paréntesis en v1). Helpers contains()/matches() case-insensitive.
 * Campos del contexto: tool, intent, bot, actor, page.url, page.host,
 * element.ref/role/name/type, key, file.path/name/extension, repeat.count.
 */

export type BoundaryMode = 'dry-run' | 'enforce'

export type PolicyContext = {
  tool?: string
  intent?: string
  bot?: string
  actor?: string
  page?: { url: string; host: string }
  element?: { ref?: string; role?: string; name?: string; type?: string }
  key?: string
  file?: { path: string; name: string; extension: string }
  repeat?: { count: number }
}

export type BoundaryPolicy = {
  mode: BoundaryMode
  deny: string[]
  allow: string[]
}

export type BoundaryDecision = {
  allowed: boolean
  mode: BoundaryMode
  matched: string | null
  source: 'deny' | 'allow' | 'default'
  forward: boolean
  reason: string
}

export type AuditRow = {
  id: string
  ts: number
  tool: string
  bot: string
  actor: string
  host: string
  decision: 'allowed' | 'refused' | 'failed'
  matched: string | null
  source: 'deny' | 'allow' | 'default'
  reason: string
  failure?: string
}

// ---- helpers registrados como globals (case-insensitive) ----
function contains(haystack: unknown, needle: unknown): boolean {
  return String(haystack ?? '').toLowerCase().includes(String(needle ?? '').toLowerCase())
}
function matches(value: unknown, pattern: unknown): boolean {
  try {
    return new RegExp(String(pattern), 'i').test(String(value))
  } catch {
    throw new Error(`not a valid pattern: ${String(pattern)}`)
  }
}

// resolución de campos del contexto a string/number
function fieldValue(ctx: PolicyContext, field: string): unknown {
  switch (field) {
    case 'tool.name': return ctx.tool
    case 'intent': return ctx.intent
    case 'bot.id': return ctx.bot
    case 'actor.id': return ctx.actor
    case 'page.url': return ctx.page?.url
    case 'page.host': return ctx.page?.host
    case 'element.ref': return ctx.element?.ref
    case 'element.role': return ctx.element?.role
    case 'element.name': return ctx.element?.name
    case 'element.type': return ctx.element?.type
    case 'key': return ctx.key
    case 'file.path': return ctx.file?.path
    case 'file.name': return ctx.file?.name
    case 'file.extension': return ctx.file?.extension
    case 'repeat.count': return ctx.repeat?.count
    default: return undefined
  }
}

// evalúa una expresión atómica: <campo> <op> <valor>
// ops: == != contains matches > < >= <=
function evalAtom(expr: string, ctx: PolicyContext): boolean {
  const m = expr.trim().match(/^(.+?)\s+(==|!=|>=|<=|>|<|contains|matches)\s+(.+)$/i)
  if (!m) throw new Error(`bad expression: ${expr}`)
  const [, rawField, op, rawVal] = m
  const field = rawField.trim()
  const val = rawVal.trim().replace(/^["']|["']$/g, '')
  const left = fieldValue(ctx, field)

  switch (op.toLowerCase()) {
    case '==': return String(left ?? '').toLowerCase() === val.toLowerCase()
    case '!=': return String(left ?? '').toLowerCase() !== val.toLowerCase()
    case '>': return Number(left) > Number(val)
    case '<': return Number(left) < Number(val)
    case '>=': return Number(left) >= Number(val)
    case '<=': return Number(left) <= Number(val)
    case 'contains': return contains(left, val)
    case 'matches': return matches(left, val)
    default: throw new Error(`bad op: ${op}`)
  }
}

// evalúa la lista (AND/OR de átomos). Falla-cerrado por átomo ya lo hace evalAtom (throw).
function evalList(list: string[], ctx: PolicyContext, onError: boolean): boolean {
  if (list.length === 0) return false
  const orParts = list.map((e) => e.split('||').map((x) => x.trim()))
  // cada "parte" es AND de átomos; las partes se OR-ean
  for (const andGroup of orParts) {
    let groupOk = true
    for (const atom of andGroup) {
      try {
        if (!evalAtom(atom, ctx)) {
          groupOk = false
          break
        }
      } catch {
        // átomo roto: en deny => true (sigue denegando); en allow => false (no permite)
        groupOk = onError
        break
      }
    }
    if (groupOk) return true
  }
  return false
}

export function evaluateBoundary(
  policy: BoundaryPolicy | null | undefined,
  ctx: PolicyContext,
): BoundaryDecision {
  const mode: BoundaryMode = policy?.mode ?? 'enforce'
  const deny = policy?.deny ?? []
  const allow = policy?.allow ?? []

  // 1) deny primero; regla rota => true (fail-closed ruidoso)
  for (const expr of deny) {
    if (evalList([expr], ctx, true)) {
      return {
        allowed: false,
        mode,
        matched: expr,
        source: 'deny',
        forward: mode === 'dry-run',
        reason: `Bloqueado por regla deny: ${expr}`,
      }
    }
  }
  // 2) allow
  for (const expr of allow) {
    if (evalList([expr], ctx, false)) {
      return {
        allowed: true,
        mode,
        matched: expr,
        source: 'allow',
        forward: true,
        reason: 'Permitido por política.',
      }
    }
  }
  // 3) default: silencio = denegar
  return {
    allowed: false,
    mode,
    matched: null,
    source: 'default',
    forward: mode === 'dry-run',
    reason:
      'Ninguna regla de esta política permite esa acción; fue rechazada. Un administrador puede añadir una.',
  }
}

// ---- repeat detector (anti-loop), inspirado en OpenBot repeat.ts ----
export type RepeatWindow = { tool?: string; ref?: string; key?: string; filePath?: string; targetUrl?: string }

export class RepeatDetector {
  private counts = new Map<string, { count: number; ts: number }>()
  constructor(private windowMs = 180_000) {}

  observe(fp: RepeatWindow): { count: number; fingerprint: string } {
    const fingerprint = JSON.stringify({
      t: fp.tool ?? '',
      r: fp.ref ?? '',
      k: fp.key ?? '',
      f: fp.filePath ?? '',
      u: fp.targetUrl ?? '',
    })
    const now = Date.now()
    const prev = this.counts.get(fingerprint)
    if (prev && now - prev.ts <= this.windowMs) {
      prev.count += 1
      prev.ts = now
      return { count: prev.count, fingerprint }
    }
    this.counts.set(fingerprint, { count: 1, ts: now })
    return { count: 1, fingerprint }
  }
}

// ---- gateway.govern() anfibio: decide, audita ANTES, luego actúa ----
export function governAction(
  policy: BoundaryPolicy | null | undefined,
  ctx: PolicyContext,
  audit: (row: Omit<AuditRow, 'id' | 'ts'>) => void,
  run: () => void,
): BoundaryDecision {
  const decision = evaluateBoundary(policy, ctx)
  // audit ANTES de actuar (allowed o refused)
  audit({
    tool: ctx.tool ?? 'unknown',
    bot: ctx.bot ?? 'local',
    actor: ctx.actor ?? 'admin',
    host: ctx.page?.host ?? '',
    decision: decision.forward ? 'allowed' : 'refused',
    matched: decision.matched,
    source: decision.source,
    reason: decision.reason,
  })
  if (!decision.forward) {
    throw new Error(decision.reason)
  }
  try {
    run()
  } catch (e) {
    audit({
      tool: ctx.tool ?? 'unknown',
      bot: ctx.bot ?? 'local',
      actor: ctx.actor ?? 'admin',
      host: ctx.page?.host ?? '',
      decision: 'failed',
      matched: decision.matched,
      source: decision.source,
      reason: decision.reason,
      failure: e instanceof Error ? e.message : 'La acción falló.',
    })
    throw e
  }
  return decision
}

export const DEFAULT_BOUNDARY_POLICY: BoundaryPolicy = {
  mode: 'enforce',
  deny: [
    // ===== TQ-GAIA INCOMPATIBILIDADES (Límites duros - NO negociables) =====
    // 1. PRECIO: TQ = energía + materiales + horas (fijo catálogo) vs Gaia variable por proyecto
    'intent contains "gaia_price_negotiation"',
    'intent contains "gaia_variable_pricing"',
    // 2. TRANSACCIONES: TQ prohíbe comisiones (Reglamento art. 10e) vs Gaia 50%/30%/10%
    'intent contains "gaia_platform_commission"',
    'intent contains "transaction_fee" && page.host contains "gaia"',
    // 3. MONEDAS: TQ = 1 kWh, sin tasa cambio, no fiat/cripto vs Gaia CORE-U/GAIAUSD
    'intent contains "gaia_fiat_exchange"',
    'intent contains "gaia_token_exchange"',
    'intent contains "gaia_elastic_supply"',
    'tool contains "exchange" && page.host contains "gaia"',
    // 4. GOBERNANZA: TQ 1 persona = 1 voto vs Gaia token holders (CORE-G)
    'intent contains "gaia_token_governance"',
    'intent contains "token_weighted_vote"',
    // 5. CAPITAL: TQ cuentas empiezan en 0 (sin capital externo) vs Gaia capital inversores/subvenciones
    'intent contains "gaia_external_capital"',
    'intent contains "external_funding" && page.host contains "gaia"',
    // ===== OTROS LÍMITES DUROS TQ =====
    'intent contains "tq_buy_sell_fiat"',
    'intent contains "tq_buy_sell_crypto"',
    'intent contains "tq_commission"',
    'intent contains "tq_price_negotiation"',
    // ===== LÍMITES ZNU ANFIBIO =====
    'intent contains "znu_conversion" && key != "allow_conversion"',
  ],
  allow: [
    'intent == "read"',
    // Enlace visible simple TQ-Gaia (referencia SIN transacción)
    'intent == "tq_catalog_reference"',
    'intent == "tq_visible_link"',
    // Operaciones TQ legítimas
    'intent == "tq_catalog_add"',
    'intent == "tq_transaction"',
    'intent == "tq_governance_vote"',
    'intent == "tq_account_create"',
    // Operaciones ZNU legítimas
    'intent == "znu_transfer"',
    'intent == "znu_demurrage"',
    'intent == "znu_caas_payout"',
    'intent == "znu_price_parity_update"',
    'intent == "znu_mode_switch"',
  ]
}
