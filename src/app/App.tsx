import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@app/layout/Layout'
import { Home } from '@app/screens/Home'
import { BaseMaterial } from '@app/screens/BaseMaterial'
import { Lucidez } from '@app/screens/Lucidez'
import { Colectivo } from '@app/screens/Colectivo'
import { Justicia } from '@app/screens/Justicia'
import { Agencia } from '@app/screens/Agencia'
import { Circulos } from '@app/screens/Circulos'
import { Credibilidad } from '@app/screens/Credibilidad'
import { Democracia } from '@app/screens/Democracia'
import { Aprender } from '@app/screens/Aprender'
import { Oraculo } from '@app/screens/Oraculo'
import { Pipeline } from '@app/screens/Pipeline'
import { GaiaUnion } from '@app/screens/GaiaUnion'
import { Flujo } from '@app/screens/Flujo'
import { Automata } from '@app/screens/Automata'
import { ZNU } from '@app/screens/ZNU'
import { Verificacion } from '@app/screens/Verificacion'
import { Simulador } from '@app/screens/Simulador'
import { Orquestacion } from '@app/screens/Orquestacion'
import { CaaS } from '@app/screens/CaaS'
import { Automat } from '@app/screens/Automat'
import { Solarpunk } from '@app/screens/Solarpunk'
import { Colaberry } from '@app/screens/Colaberry'
import { Priorizar } from '@app/screens/Priorizar'
import { Vesting } from '@app/screens/Vesting'
import { Trustlines } from '@app/screens/Trustlines'
import { Tekitl } from '@app/screens/Tekitl'
import { Soberania } from '@app/screens/Soberania'
import { Integral } from '@app/screens/Integral'
import { Mundus } from '@app/screens/Mundus'
import { Life } from '@app/screens/Life'
import { Civilizaciones } from '@app/screens/Civilizaciones'
import { Celulas } from '@app/screens/Celulas'
import { Delegacion } from '@app/screens/Delegacion'
import { Capacidades } from '@app/screens/Capacidades'
import { Educacion } from '@app/screens/Educacion'
import { SoberaniaCredito } from '@app/screens/SoberaniaCredito'
import { Regen } from '@app/screens/Regen'
import { Vecinal } from '@app/screens/Vecinal'
import { Nostr } from '@app/screens/Nostr'
import { Agentes } from '@app/screens/Agentes'
import { OoAgents } from '@app/screens/OoAgents'
import { Contenido } from '@app/screens/Contenido'
import { Fuentes } from '@app/screens/Fuentes'
import { Boundaries } from '@app/screens/Boundaries'
import { Coworkers } from '@app/screens/Coworkers'
import { MetaCrisis } from '@app/screens/MetaCrisis'
import { Nextcloud } from '@app/screens/Nextcloud'
import { Story } from '@app/screens/Story'
import { Visual } from '@app/screens/Visual'
import { Avatar } from '@app/screens/Avatar'
import { AgentCanvas } from '@app/screens/AgentCanvas'
import { Video } from '@app/screens/Video'
import { Highlight } from '@app/screens/Highlight'


export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="base" element={<BaseMaterial />} />
        <Route path="lucidez" element={<Lucidez />} />
        <Route path="colectivo" element={<Colectivo />} />
        <Route path="justicia" element={<Justicia />} />
        <Route path="agencia" element={<Agencia />} />
        <Route path="circulos" element={<Circulos />} />
        <Route path="credibilidad" element={<Credibilidad />} />
        <Route path="democracia" element={<Democracia />} />
        <Route path="aprender" element={<Aprender />} />
        <Route path="oraculo" element={<Oraculo />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="gaiaunion" element={<GaiaUnion />} />
        <Route path="flujo" element={<Flujo />} />
        <Route path="automata" element={<Automata />} />
        <Route path="znu" element={<ZNU />} />
        <Route path="verificacion" element={<Verificacion />} />
        <Route path="orquestacion" element={<Orquestacion />} />
        <Route path="caas" element={<CaaS />} />
        <Route path="automat" element={<Automat />} />
        <Route path="solarpunk" element={<Solarpunk />} />
        <Route path="colaberry" element={<Colaberry />} />
        <Route path="priorizar" element={<Priorizar />} />
        <Route path="vesting" element={<Vesting />} />
        <Route path="trustlines" element={<Trustlines />} />
        <Route path="tekitl" element={<Tekitl />} />
        <Route path="soberania" element={<Soberania />} />
        <Route path="integral" element={<Integral />} />
        <Route path="mundus" element={<Mundus />} />
        <Route path="life" element={<Life />} />
        <Route path="civilizaciones" element={<Civilizaciones />} />
        <Route path="celulas" element={<Celulas />} />
        <Route path="delegacion" element={<Delegacion />} />
        <Route path="capacidades" element={<Capacidades />} />
        <Route path="educacion" element={<Educacion />} />
        <Route path="soberania-credito" element={<SoberaniaCredito />} />
        <Route path="regen" element={<Regen />} />
        <Route path="vecinal" element={<Vecinal />} />
        <Route path="nostr" element={<Nostr />} />
        <Route path="agentes" element={<Agentes />} />
        <Route path="oo-agents" element={<OoAgents />} />
        <Route path="contenido" element={<Contenido />} />
        <Route path="fuentes" element={<Fuentes />} />
        <Route path="boundaries" element={<Boundaries />} />
        <Route path="coworkers" element={<Coworkers />} />
        <Route path="meta-crisis" element={<MetaCrisis />} />
        <Route path="nextcloud" element={<Nextcloud />} />
        <Route path="verificacion" element={<Verificacion />} />
        <Route path="simulador" element={<Simulador />} />
      </Route>
        <Route path="story" element={<Story />} />
        <Route path="visual" element={<Visual />} />
        <Route path="avatar" element={<Avatar />} />
        <Route path="canvas" element={<AgentCanvas />} />
        <Route path="video" element={<Video />} />
        <Route path="highlight" element={<Highlight />} />
            <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
