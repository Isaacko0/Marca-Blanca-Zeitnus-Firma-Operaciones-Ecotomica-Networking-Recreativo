# Spec OpenSpec: Integración Neynar Managed Signers → HSCSG/ALRAC

**Estado:** borrador de integración  
**Licencia:** MIT (Zeitnus/HSCSG core) + conceptos de documentación pública Neynar (atribución a Neynar)  
**Fuente:** https://docs.neynar.com/docs/write-data-with-managed-signers  
**Atribución:** Neynar — documentación pública de Managed Signers para Farcaster  
**Fecha:** 2026-10-28

## 1. ¿Qué es Neynar Managed Signers?

Producto de Neynar que permite a aplicaciones escribir en el protocolo Farcaster gestionando signers criptográficos en nombre de usuarios. El usuario no gestiona mnemonics ni claves privadas; autoriza vía QR o deeplink Warpcast. Neynar patrocina onchain fees por defecto ($0 para el usuario).

## 2. Especificaciones OpenSpec sugeridas

### 2.1 Signer Gestionado para Protocolo Social Soberano

```
interface ManagedSigner {
  id: string;                          // signer_uuid
  publicKey: string;                   // clave pública del signer
  status: 'pending_approval' | 'approved' | 'revoked';
  ownerDid: string;                    // DID del usuario dueño
  appFid: bigint;                      // FID de la aplicación desarrolladora
  deadline: number;                    // timestamp de expiración de la firma
  registeredAt: number;                // timestamp de registro
  sponsored: boolean;                  // Neynar patrocina onchain fees
  approvalUrl?: string;                // Warpcast deeplink para aprobación usuario
}
```

**Reglas:**
- Un signer debe ser aprobado por el usuario antes de poder publicar casts.
- La firma EIP-712 tiene deadline de 24 horas; expira si no se usa.
- El developer account (appFid) firma el registro del signer.
- Neynar patrocina los onchain fees del registro del signer.

### 2.2 Publicación de Cast (mensaje en protocolo social)

```
interface CastPublishRequest {
  signerUuid: string;                  // signer aprobado y activo
  text: string;                        // contenido del cast
  parentCastId?: string;               // si es respuesta
  parentUrl?: string;                  // si es respuesta con URL
}

interface CastPublishResult {
  success: boolean;
  cast: {
    hash: string;
    author: {
      fid: bigint;
      username: string;
      displayName: string;
      custodyAddress: string;
    };
    text: string;
    timestamp: number;
  };
}
```

**Reglas:**
- Solo se puede publicar con signer_uuid aprobado.
- El texto del cast es el contenido inmutable de la transmisión.
- El autor se deriva del signer, no se falsifica.

### 2.3 Flujo de creación de signer (developer account)

```
interface DeveloperAccount {
  mnemonic: string;                    // 12-24 palabras, cuenta desarrollador Farcaster
  fid: bigint;                         // FID obtenido vía lookup por custody address
  custodyAddress: string;              // dirección derivada del mnemonic
}

interface SignerCreationFlow {
  1. createSigner(): signerUuid, publicKey;
  2. signKeyRequest(developerMnemonic, publicKey, deadline): signature;
  3. registerSignedKey(signerUuid, appFid, deadline, signature): signedKey;
  4. user approves via QR/deeplink Warpcast;
  5. signer status → approved;
}
```

## 3. Mapeo a capas ALRAC (resumen ejecutivo)

| Capa ALRAC | Concepto Neynar | Implementación TypeScript sugerida |
|---|---|---|
| Capa 0 (Epistémica/AMID) | Autenticación (SIWF/Privy), autorización, consentimiento verificable | `src/core/lib/auth-soberano.ts` |
| Capa 1 (Contable-física TQ) | Onchain fees patrocinados, costo de transacción como TQ | `src/core/lib/tq.ts` (verifyTQProhibition) |
| Capa 2 (Interoperabilidad) | Farcaster protocolo, Neynar API, mnemonic custody | `src/core/lib/social-protocol.ts` |
| Capa 3 (Membrana Fiat/ZEITNUS) | Developer mnemonic, puente a onchain, patrocinio | `src/core/lib/vasos-comunicantes.ts` |
| Capa 4 (Aplicación ZEITNUS) | API routes signer/cast, UI de aprobación | `src/app/api/signer/route.ts`, `src/app/api/cast/route.ts` |
| Capa 5 (Gobernanza) | Quién puede publicar, quién patrocina, reglas de acceso | `src/core/state/store.ts` |

## 4. Reglas de negocio traducidas

1. **Autenticación antes que autorización:** Primero SIWF/Privy (prueba de identidad), luego Neynar signer (permiso para actuar).
2. **Custodia compartida:** Neynar gestiona el signer; el usuario aprueba pero no maneja claves privadas.
3. **Developer account patrocina:** El mnemonic del desarrollador firma registros y cubre costos onchain.
4. **Firma con deadline:** EIP-712 con expiración (24h default); límite temporal como frontera de seguridad.
5. **Aprobación explícita del usuario:** QR o deeplink Warpcast; `pending_approval` hasta que el usuario actúe.
6. **Write access controlado:** Solo signer_uuid aprobado puede publicar casts.

## 5. Verificación (Fase 3)

- [ ] Consistencia con `verifyTQProhibition` en `src/core/lib/tq.ts` (TQ ≠ fiat/cripto)
- [ ] Consistencia con triaxial verification en `src/core/lib/alrac.ts`
- [ ] No copiar código literal de Neynar sin atribución; reimplementar patrones en TypeScript
- [ ] Confirmar specs OpenSpec bajo MIT con atribución a Neynar

## 6. Referencias

- https://docs.neynar.com/llms.txt — Índice de documentación Neynar
- https://docs.neynar.com/docs/write-data-with-managed-signers — Guía completa (origen de esta asimilación)
- https://github.com/neynarxyz/farcaster-examples/tree/main/managed-signers — Repositorio de ejemplo
- https://docs.neynar.com/docs/two-ways-to-sponsor-a-farcaster-signer-via-neynar.md — Patrocinio de signers
- Repo Zeitnus: github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo (MIT)

**Principio rector:** El código es territorio. La documentación es mapa. La verdad es el territorio. E=V.
