import { User, Mic, Video, ShieldCheck, ShieldAlert } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import { Card, Stat, Btn } from '@components/ui'

export function Avatar() {
  const { avatar, setAvatarExpression, toggleAvatarStreaming, grantAvatarConsent, revokeAvatarConsent } = useAppStore()

  const exprOptions = ['neutral', 'happy', 'sad', 'surprised', 'thinking'] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <User className="w-6 h-6 text-chispa" />
          Avatar Live · PersonaLive
        </h1>
        <p className="text-[var(--dim)] mt-1">Animación de retrato · expresión → streaming (consentimiento Ley III)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Estado" value={avatar.active ? 'ACTIVO' : 'INACTIVO'} color={avatar.active ? 'text-emerald-400' : 'text-orange-400'} />
        <Stat label="Expresión" value={avatar.expression} sub="Estado ánimo" />
        <Stat label="Frame" value={String(avatar.frame)} sub={avatar.streaming ? 'STREAMING' : 'PAUSADO'} />
        <Stat label="Consentimiento" value={avatar.consent ? 'SÍ' : 'NO'} color={avatar.consent ? 'text-emerald-400' : 'text-red-400'} sub="Ley III" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Retrato animado">
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-[var(--surf2)] border-2 border-[var(--line)] flex items-center justify-center">
              <User className="w-16 h-16 text-chispa" />
            </div>
            <p className="mt-4 font-medium">Avatar del Nodo</p>
            <p className="text-[var(--dim)] text-sm">Expresión: {avatar.expression}</p>
            <div className="flex justify-center gap-2 mt-4">
              <Btn onClick={toggleAvatarStreaming}>
                <Video className="w-4 h-4" /> {avatar.streaming ? 'Detener' : 'Iniciar'} stream
              </Btn>
            </div>
          </div>
        </Card>

        <Card title="Control de expresiones">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {exprOptions.map(expr => (
                <button
                  key={expr}
                  onClick={() => setAvatarExpression(expr)}
                  className={`px-3 py-2 rounded-lg border text-sm capitalize ${
                    avatar.expression === expr
                      ? 'bg-chispa border-chispa text-black'
                      : 'border-[var(--line)] text-[var(--mut)] hover:bg-[var(--surf2)]'
                  }`}
                >
                  {expr}
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-[var(--line)]">
              {avatar.consent ? (
                <div className="space-y-2">
                  <p className="text-emerald-400 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Consentimiento otorgado (Ley III)
                  </p>
                  <Btn onClick={revokeAvatarConsent}>
                    <ShieldAlert className="w-4 h-4" /> Revocar consentimiento
                  </Btn>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-orange-400 text-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Sin consentimiento
                  </p>
                  <Btn onClick={grantAvatarConsent}>
                    <ShieldCheck className="w-4 h-4" /> Otorgar consentimiento (solo uso propio)
                  </Btn>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
