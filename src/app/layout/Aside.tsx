import {
  Mountain, Database, Eye, Users, Cpu, Coins, LayoutDashboard, Network, Radio, Gauge, SlidersHorizontal, Users2, Bot, Leaf, MessagesSquare, ListChecks, Unlock, Link2, Briefcase, ShieldHalf, RefreshCw, Globe, LifeBuoy, Compass, Scale, Award, Landmark, GraduationCap, HelpCircle, Workflow, Dna, Waypoints, Boxes, PenLine,
  ChevronsLeft, ChevronsRight,
  GitBranch, ShieldCheck, Library, Brain, Cloud,
  BookOpen, Palette, Film, Scissors, User} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '@core/state/store'
import { clsx } from 'clsx'
import { t } from '@core/lib/i18n'

const NAV_ITEMS = [
  { key: 'home', navKey: 'nav.home', icon: LayoutDashboard, color: 'text-chispa', path: '/' },
  { key: 'base', navKey: 'nav.base', icon: Mountain, color: 'text-emerald-400', path: '/base' },
  { key: 'lucidez', navKey: 'nav.lucidez', icon: Database, color: 'text-lime-400', path: '/lucidez' },
  { key: 'colectivo', navKey: 'nav.colectivo', icon: Users, color: 'text-purple-400', path: '/colectivo' },
  { key: 'justicia', navKey: 'nav.justicia', icon: Scale, color: 'text-rose-400', path: '/justicia' },
  { key: 'agencia', navKey: 'nav.agencia', icon: Briefcase, color: 'text-fuchsia-400', path: '/agencia' },
  { key: 'circulos', navKey: 'nav.circulos', icon: Network, color: 'text-emerald-400', path: '/circulos' },
  { key: 'credibilidad', navKey: 'nav.credibilidad', icon: Award, color: 'text-emerald-400', path: '/credibilidad' },
  { key: 'democracia', navKey: 'nav.democracia', icon: Landmark, color: 'text-emerald-400', path: '/democracia' },
  { key: 'aprender', navKey: 'nav.aprender', icon: GraduationCap, color: 'text-fuchsia-400', path: '/aprender' },
  { key: 'oraculo', navKey: 'nav.oraculo', icon: HelpCircle, color: 'text-amber-400', path: '/oraculo' },
  { key: 'pipeline', navKey: 'nav.pipeline', icon: Workflow, color: 'text-cyan-400', path: '/pipeline' },
  { key: 'gaiaunion', navKey: 'nav.gaiaunion', icon: Dna, color: 'text-emerald-400', path: '/gaiaunion' },
  { key: 'flujo', navKey: 'nav.flujo', icon: Waypoints, color: 'text-cyan-400', path: '/flujo' },
  { key: 'automata', navKey: 'nav.automata', icon: Cpu, color: 'text-cyan-400', path: '/automata' },
  { key: 'znu', navKey: 'nav.znu', icon: Coins, color: 'text-amber-400', path: '/znu' },
  { key: 'verificacion', navKey: 'nav.verificacion', icon: Eye, color: 'text-sky-400', path: '/verificacion' },
  { key: 'orquestacion', navKey: 'nav.orquestacion', icon: Network, color: 'text-rose-400', path: '/orquestacion' },
  { key: 'caas', navKey: 'nav.caas', icon: Users2, color: 'text-fuchsia-400', path: '/caas' },
  { key: 'automat', navKey: 'nav.automat', icon: Bot, color: 'text-cyan-400', path: '/automat' },
  { key: 'solarpunk', navKey: 'nav.solarpunk', icon: Leaf, color: 'text-emerald-400', path: '/solarpunk' },
  { key: 'colaberry', navKey: 'nav.colaberry', icon: MessagesSquare, color: 'text-violet-400', path: '/colaberry' },
  { key: 'priorizar', navKey: 'nav.priorizar', icon: ListChecks, color: 'text-orange-400', path: '/priorizar' },
  { key: 'vesting', navKey: 'nav.vesting', icon: Unlock, color: 'text-amber-400', path: '/vesting' },
  { key: 'trustlines', navKey: 'nav.trustlines', icon: Link2, color: 'text-teal-400', path: '/trustlines' },
  { key: 'tekitl', navKey: 'nav.tekitl', icon: Briefcase, color: 'text-sky-400', path: '/tekitl' },
  { key: 'soberania', navKey: 'nav.soberania', icon: ShieldHalf, color: 'text-emerald-400', path: '/soberania' },
  { key: 'integral', navKey: 'nav.integral', icon: RefreshCw, color: 'text-emerald-400', path: '/integral' },
  { key: 'mundus', navKey: 'nav.mundus', icon: Globe, color: 'text-sky-400', path: '/mundus' },
  { key: 'life', navKey: 'nav.life', icon: LifeBuoy, color: 'text-emerald-400', path: '/life' },
  { key: 'civilizaciones', navKey: 'nav.civilizaciones', icon: Compass, color: 'text-emerald-400', path: '/civilizaciones' },
  { key: 'celulas', navKey: 'nav.celulas', icon: Network, color: 'text-emerald-400', path: '/celulas' },
  { key: 'delegacion', navKey: 'nav.delegacion', icon: GitBranch, color: 'text-emerald-400', path: '/delegacion' },
  { key: 'capacidades', navKey: 'nav.capacidades', icon: ShieldCheck, color: 'text-emerald-400', path: '/capacidades' },
  { key: 'educacion', navKey: 'nav.educacion', icon: GraduationCap, color: 'text-emerald-400', path: '/educacion' },
  { key: 'soberania-credito', navKey: 'nav.soberania-credito', icon: ShieldCheck, color: 'text-emerald-400', path: '/soberania-credito' },
  { key: 'regen', navKey: 'nav.regen', icon: Leaf, color: 'text-emerald-400', path: '/regen' },
  { key: 'vecinal', navKey: 'nav.vecinal', icon: Users, color: 'text-emerald-400', path: '/vecinal' },
  { key: 'nostr', navKey: 'nav.nostr', icon: Radio, color: 'text-emerald-400', path: '/nostr' },
  { key: 'agentes', navKey: 'nav.agentes', icon: Bot, color: 'text-emerald-400', path: '/agentes' },
  { key: 'oo-agents', navKey: 'nav.ooAgents', icon: Boxes, color: 'text-emerald-400', path: '/oo-agents' },
  { key: 'contenido', navKey: 'nav.contenido', icon: PenLine, color: 'text-emerald-400', path: '/contenido' },
  { key: 'verificacion', navKey: 'nav.verificacionPor', icon: Gauge, color: 'text-emerald-400', path: '/verificacion' },
  { key: 'simulador', navKey: 'nav.simulador', icon: SlidersHorizontal, color: 'text-emerald-400', path: '/simulador' },
  { key: 'fuentes', navKey: 'nav.fuentes', icon: Library, color: 'text-amber-400', path: '/fuentes' },
  { key: 'boundaries', navKey: 'nav.boundaries', icon: ShieldCheck, color: 'text-rose-400', path: '/boundaries' },
  { key: 'coworkers', navKey: 'nav.coworkers', icon: Users, color: 'text-sky-400', path: '/coworkers' },
  { key: 'meta-crisis', navKey: 'nav.metaCrisis', icon: Brain, color: 'text-emerald-400', path: '/meta-crisis' },
  { key: 'nextcloud', navKey: 'nav.nextcloud', icon: Cloud, color: 'text-blue-400', path: '/nextcloud' },
  { key: 'story', navKey: 'nav.story', icon: BookOpen, color: 'text-amber-400', path: '/story' },
  { key: 'visual', navKey: 'nav.visual', icon: Palette, color: 'text-emerald-400', path: '/visual' },
  { key: 'avatar', navKey: 'nav.avatar', icon: User, color: 'text-cyan-400', path: '/avatar' },
  { key: 'canvas', navKey: 'nav.canvas', icon: Bot, color: 'text-fuchsia-400', path: '/canvas' },
  { key: 'video', navKey: 'nav.video', icon: Film, color: 'text-rose-400', path: '/video' },
  { key: 'highlight', navKey: 'nav.highlight', icon: Scissors, color: 'text-orange-400', path: '/highlight' },
] as const

interface AsideProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Aside({ collapsed, onToggleCollapse }: AsideProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { nodeName, lang } = useAppStore()

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const asideStyle = {
    width: collapsed ? '70px' : '256px',
    transition: 'width 0.34s cubic-bezier(0.16,1,0.3,1)',
  } as React.CSSProperties

  return (
    <aside
      className="flex flex-col bg-[var(--surf)] border-r border-[var(--lineq)] flex-shrink-0 z-60"
      style={asideStyle}
      aria-label="Navegación principal"
    >
      <div className="flex items-center gap-3 p-4 border-b border-[var(--lineq)] min-h-[70px]">
        {!collapsed && (
          <>
            <div className="w-10 h-10 rounded-xl bg-[var(--grad-wish)] flex items-center justify-center flex-shrink-0">
              <span className="font-jost font-bold text-lg text-[var(--vacio)]">HS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-jost font-semibold truncate">HSCSG v15 OS</p>
              <p className="text-[var(--dim)] text-xs truncate">{nodeName}</p>
            </div>
          </>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-[var(--grad-wish)] flex items-center justify-center mx-auto">
            <span className="font-jost font-bold text-lg text-[var(--vacio)]">HS</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2" role="navigation" aria-label="Módulos">
        <ul className="space-y-1" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => navigate(item.path)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-chispa focus-visible:ring-offset-2 focus-visible:ring-offset-vacio',
                  isActive(item.path)
                    ? 'bg-[var(--grad-wish)] text-white shadow-[0_0_20px_rgba(175,235,0,0.25)]'
                    : 'text-[var(--mut)] hover:text-white hover:bg-[var(--surf2)]',
                  collapsed && 'justify-center px-0',
                )}
                aria-current={isActive(item.path) ? 'page' : undefined}
                title={collapsed ? t(item.navKey, lang) : undefined}
              >
                <item.icon className={clsx('w-5 h-5 flex-shrink-0', item.color)} aria-hidden="true" />
                {!collapsed && <span className="font-manrope font-medium whitespace-nowrap text-[13px]">{t(item.navKey, lang)}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[var(--lineq)]">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-chispa co-pulse" aria-hidden="true" />
              <span className="font-jost font-medium text-xs uppercase tracking-wide">Lucidez Material</span>
            </div>
            <p className="text-[var(--dim)] text-xs mb-3">
              La implementación es ontogénesis. El territorio es la única verdad.
            </p>
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-[var(--line)] text-[var(--mut)] hover:text-white hover:bg-[var(--surf2)] transition-colors"
              aria-label="Colapsar panel"
            >
              <ChevronsLeft className="w-5 h-5" />
              <span className="font-manrope font-medium">Colapsar</span>
            </button>
          </>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center px-3 py-2 rounded-xl border border-[var(--line)] text-[var(--mut)] hover:text-white hover:bg-[var(--surf2)] transition-colors"
            aria-label="Expandir panel"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  )
}
