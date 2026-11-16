# Gratifieria Assimilation Patterns (Portado de solarpunk_utopia)

## Origen: solarpunk_utopia ValueFlows + MutualAidMatchmaker

| Componente Original | Archivo Origen | Adaptación ARM |
|---|---|---|
| ValueFlows Listing | `valueflows_node/app/models/vf/listing.py` | `src/types.ts` → `Listing` interface |
| MutualAidMatchmaker | `app/agents/mutual_aid_matchmaker.py` | `agents/matchmaker.ts` → `GratifieriaMatchmaker` |
| Algorithmic Transparency | `app/models/algorithmic_transparency.py` | `types.ts` → `MatchExplanation`, `MatchingAuditLog` |
| Transparency Repository | `app/repositories/transparency_repository.py` | `core/repository.ts` → `TransparencyRepository` |
| ValueFlows Client | `app/clients/vf_client.py` | `arm-cli` actions + `arm-core` ops |
| Agent Framework | `app/agents/framework.py` | `arm-core` Agent types + `arm-mcp` tools |

## Adaptaciones Clave

### 1. Listing → ARM Listing
```python
# Python (original)
@dataclass
class Listing:
    id: str
    listing_type: ListingType
    resource_spec_id: str
    agent_id: Optional[str] = None
    anonymous: bool = False  # GAP-61
    quantity: float = 1.0
    unit: str = "items"
    available_from: Optional[datetime] = None
    available_until: Optional[datetime] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: str = "active"
    community_id: Optional[str] = None
    visibility: Optional[str] = None
```
```typescript
// TypeScript (ARM)
interface Listing {
  id: string;                          // lst_*
  listing_type: ListingType;           // "offer" | "need"
  resource_spec_id: string;            // taxonomy ref
  agent_id?: string;
  anonymous: boolean;                  // GAP-61
  quantity: number; unit: Unit;
  available_from?: string; available_until?: string;
  title?: string; description?: string;
  status: ListingStatus;               // active, matched, fulfilled, expired, cancelled
  community_id?: string;
  visibility?: VisibilityScope;
}
```

### 2. MutualAidMatchmaker → GratifieriaMatchmaker
```python
# Python: scoring weights hardcoded
weights = type('obj', (object,), {
    'category_weight': 0.4,
    'location_weight': 0.3,
    'time_weight': 0.2,
    'quantity_weight': 0.1,
})()

# Transparency: MatchExplanation + MatchingAuditLog
class MutualAidMatchmaker:
    async def _log_audit_trail(...): ...
    async def create_match_explanation(...): ...
```
```typescript
// TypeScript: weights configurables per community
interface MatchWeights {
  category_weight: number;  // default 0.4
  location_weight: number;  // default 0.3
  time_weight: number;      // default 0.2
  quantity_weight: number;  // default 0.1
  min_match_score: number;  // default 0.6
}

// Transparency obligatoria
class GratifieriaMatchmaker {
  async analyze(): Promise<Match[]>;
  async logAuditTrail(...): Promise<void>;
  async createMatchExplanation(...): Promise<MatchExplanation>;
}
```

### 3. Karma System (Nuevo - no en original)
```typescript
// Anfibio: postmonetario (ZNU) | conectado (USD via oracle)
interface KarmaAccount {
  znu_balance: number;
  usd_balance?: number;        // solo modo conectado
  total_given: number;
  total_received: number;
  trust_score: number;
}

// Rewards: fulfillment(+10 ZNU), anonymous gift GAP-61(+20 ZNU), cancellation(-5 ZNU)
```

### 4. Swipe UX (Tinder-like) - Nuevo
```typescript
interface SwipeRecord {
  id: string; user_id: string; listing_id: string;
  action: "like" | "pass" | "super_like";
  created_at: string; match_id?: string;
}
```

### 5. Community Governance (MatchWeights)
```typescript
// Pesos gobernables per community
interface MatchWeights {
  id: string; community_id?: string;
  category_weight: number; location_weight: number;
  time_weight: number; quantity_weight: number;
  min_match_score: number;
  is_active: boolean;
}
```

## Diferencias Clave vs Original

| Aspecto | solarpunk_utopia (Python) | ARM Gratifieria (TypeScript) |
|---|---|---|
| **Lenguaje** | Python 3.11 | TypeScript 5.9 (Node 22.18+) |
| **Arquitectura** | Monolito FastAPI | 5 paquetes npm + monorepo |
| **Persistence** | SQLite + DTN bundles | InMemory repos (swappable) |
| **Transport** | DTN + NATS | MCP stdio + Loopback HTTP |
| **Agents** | 7 agentes especializados | 1 Matchmaker + MCP tools |
| **Transparency** | AuditLog + Explanation | MatchExplanation + MatchingAuditLog |
| **Karma** | No existe | Anfibio ZNU/USD + rewards |
| **Swipe UX** | No existe | Tinder-like (like/pass/super_like) |
| **Governance** | No explícita | MatchWeights per community |
| **Anfibia** | No | valueDual.ts pattern |
| **OpenSpec** | No | Specs YAML validadas |

## Flujo de Asimilación Aplicado

1. **FASE 1**: Clonado solarpunk_utopia → análisis `mutual_aid_matchmaker.py` + `listing.py`
2. **FASE 2**: `backup.md` + `integration.md` con triple perspectiva
3. **FASE 3**: Generación 5 paquetes ARM + `arm-gratiferia` (6to paquete)
4. **FASE 4**: OpenSpec specs validadas + InMemory repos + MCP server
5. **FASE 5**: `zentrik-arm-assimilation.md` + `arm-gratiferia-patterns.md` en skill references

## Tests KPI para Gratifieria
| Módulo | KPIs Mínimos |
|---|---|
| Matchmaker | scoring accuracy > 90%, audit trail 100% coverage |
| Karma | transfer atomicity, dual mode parity, trust_score monotonic |
| Repository | CRUD latency < 5ms, filter accuracy 100% |
| MCP Server | 14 tools respond < 100ms, stdio protocol compliance |
| Swipe UX | like→match latency < 200ms, pass no side effects |

## Pitfalls Específicos ARM-Gratifieria (Esta Sesión)

| Categoría | Pitfall | Solución |
|---|---|---|
| **Monorepo npm workspaces** | `npm error EUNSUPPORTEDPROTOCOL` con `workspace:*` | Usar `file:../arm-core` en package.json; npm 11 no soporta `workspace:*` |
| **CRLF en store.ts** | Windows usa CRLF; patches rompen silenciosamente | Preservar \n\n; usar newline="" en Python; indentación 48/50/52/54 espacios |
| **Spanish-first violado** | TODOS los docs, comentarios, strings en español | i18n ES/EN/PT obligatorio |
| **Imports @hscsg/arm-core en arm-gratiferia** | TS errors: "Cannot find module" | Usar paths relativos (`./core/*`, `../types`) en lugar de alias workspace |
| **structuredClone no disponible** | Runtime error en demo.ts | `JSON.parse(JSON.stringify(obj))` para deep clone compatible |
| **Violet = agent token** | CSS tokens: violet reservado para agent work | Usar semantic tokens, evitar one-off colors |
| **Principio Anfibio violado** | Lógica solo postmonetario o solo conectado | Aplicar postmonetario/conectado en TODA la lógica (priceParity, nodeMode) |
| **GAP-61 anonymous gifts** | Olvidar bonus karma en anonymous gifts | `anonymous: true` en Listing → `rewardAnonymousGift()` en fulfill |
| **Community weights** | Hardcodear pesos en matchmaker | `MatchWeights` per community en `TransparencyRepository` |
| **Swipe UX state** | Swipe session no persiste entre CLI runs | `SwipeRecord` + `SwipeRepository` con `user_id` + `listing_id` |
| **OpenSpec YAML validation** | Specs pasan lint pero fallan en runtime | `openspec validate --spec` en CI + `npm run spec:validate` en scripts |
| **MCP stdio protocol** | Tools no responden / parse errors | JSON-RPC 2.0 estricto: `jsonrpc: "2.0"`, `id` required, `result`/`error` mutually exclusive |
| **InMemory repo leaks** | Tests comparten estado entre runs | `new InMemoryRepositories()` por test; no singletons |
| **Amphibious dual mode** | Hardcodear USD o ZNU | `valueDual.ts` + `detectModeFromEnv()` + `createDualConfig()` en todo cálculo monetario |
| **ARM-gratiferia deps** | Circular deps arm-gratiferia → arm-cli → arm-core | `arm-gratiferia` depende de `arm-core` + `arm-cli` (actions, store) solo |
| **Test KPIs missing** | Build pasa pero matchmaker score < 90% | Tests unitarios obligatorios: scoring, audit trail, dual mode parity |
| **Zenodo deposit** | Papers sin DOI en release | `git tag docs/vX.Y` → Zenodo deposit inmediato → DOI en metadata |
| **Vasos comunicantes rotos** | Paper sin `[EBD-D#]` o `[KPI-]` o `[src/...]` | Rechazar en review; citas internas obligatorias en TODO documento |
| **MCP tool schema** | `inputSchema` rechaza valid params | `additionalProperties: false` + `required` exactos; testear con `tools/call` |
| **Arquitectura Swappable** | Implementaciones divergen (SQLite vs InMemory) | Interface única en `core/repository.ts`; implementations swappable |
| **Circular deps ARM-Gratifieria** | Circular deps arm-gratiferia → arm-cli → arm-core | `arm-gratiferia` depende de `arm-core` + `arm-cli` (actions, store) solo |
| **Test KPIs missing** | Build pasa pero matchmaker score < 90% | Tests unitarios obligatorios: scoring, audit trail, dual mode parity |
| **Zenodo deposit** | Papers sin DOI en release | `git tag docs/vX.Y` → Zenodo deposit inmediato → DOI en metadata |
| **Vasos comunicantes rotos** | Paper sin `[EBD-D#]` o `[KPI-]` o `[src/...]` | Rechazar en review; citas internas obligatorias en TODO documento |
| **MCP tool schema** | `inputSchema` rechaza valid params | `additionalProperties: false` + `required` exactos; testear con `tools/call` |
| **Arquitectura Swappable** | Implementaciones divergen (SQLite vs InMemory) | Interface única en `core/repository.ts`; implementations swappable |
| **Circular deps ARM-Gratifieria** | Circular deps arm-gratiferia → arm-cli → arm-core | `arm-gratiferia` depende de `arm-core` + `arm-cli` (actions, store) solo |
| **Test KPIs missing** | Build pasa pero matchmaker score < 90% | Tests unitarios obligatorios: scoring, audit trail, dual mode parity |
| **Zenodo deposit** | Papers sin DOI en release | `git tag docs/vX.Y` → Zenodo deposit inmediato → DOI en metadata |
| **Vasos comunicantes rotos** | Paper sin `[EBD-D#]` o `[KPI-]` o `[src/...]` | Rechazar en review; citas internas obligatorias en TODO documento |
| **MCP tool schema** | `inputSchema` rechaza valid params | `additionalProperties: false` + `required` exactos; testear con `tools/call` |
| **Arquitectura Swappable** | Implementaciones divergen (SQLite vs InMemory) | Interface única en `core/repository.ts`; implementations swappable |

## Próximos Pasos de Integración
- [ ] `arm-ui` SwipeSession component (Tinder-like)
- [ ] `/agencia` screen para toggle modo monetario
- [ ] `arm-gratiferia` tests unitarios + e2e
- [ ] Integración `hscsg-sistema-alraico` kernel
- [ ] Zenodo deposit para specs + patterns