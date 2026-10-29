# Backup Local — Neynar Managed Signers (Documentación oficial)

**Fuente:** https://docs.neynar.com/llms.txt y guía "Write Data with Managed Signers"  
**Autor/Empresa:** Neynar  
**Licencia:** Documentación pública de Neynar (conceptos y arquitectura reimplementables; no se copia código literal sin atribución explícita)  
**Fecha de backup:** 2026-10-28  
**Estado:** Documentación técnica de integración de Neynar Managed Signers con protocolo Farcaster en Next.js

## Estructura de la documentación (backup de referencia)

```
Documentación Neynar Managed Signers
├── Contexto y terminología
│   ├── Autenticación (SIWF / Privy) — prueba de identidad
│   ├── Autorización (Neynar signer) — privilegios para actuar en nombre de la cuenta
│   └── User journey: autenticación → autorización → firma QR/deeplink Warpcast
├── Requisitos
│   ├── Node.js LTS
│   ├── Next.js
│   ├── Dependencias: @farcaster/hub-nodejs, @neynar/nodejs-sdk, viem
│   └── Variables de entorno: NEYNAR_API_KEY, FARCASTER_DEVELOPER_MNEMONIC
├── Estructura de directorios
│   ├── app/api/signer/route.ts          — Creación de signer
│   ├── app/api/cast/route.ts            — Publicación de cast
│   ├── lib/neynarClient.ts              — Cliente Neynar API
│   ├── utils/getFid.ts                  — Obtener FID del developer account
│   ├── utils/getSignedKey.ts            — Crear y registrar signed key
│   └── .env.local
└── Flujo de operación
    ├── POST /api/signer — crea signer, genera firma, registra signed key
    ├── Usuario aprueba vía QR/deeplink en Warpcast (onchain, patrocinado por Neynar por defecto)
    └── POST /api/cast — publica cast en Farcaster con signer_uuid y texto
```

## Arquitectura técnica identificada

| Componente | Responsabilidad | Tecnología |
|---|---|---|
| `lib/neynarClient.ts` | Cliente API Neynar (Configuration + NeynarAPIClient) | `@neynar/nodejs-sdk` |
| `utils/getFid.ts` | Obtiene FID del developer account desde mnemonic + custody address | `viem/accounts`, Neynar API |
| `utils/getSignedKey.ts` | Crea signer, genera EIP-712 signature, registra signed key | `@farcaster/hub-nodejs`, `viem`, Neynar API |
| `app/api/signer/route.ts` | Endpoint POST que expone creación de signer | Next.js Route Handler |
| `app/api/cast/route.ts` | Endpoint POST que publica cast en Farcaster | Next.js Route Handler, Neynar API |

## Flujo de usuario ideal

1. **Autenticación:** Usuario se autentica (SIWF con Neynar o login provider como Privy).
2. **Autorización:** Usuario autoriza a la app a actuar en su nombre en Farcaster.
3. **Creación de signer:** Backend crea un signer gestionado por Neynar para el usuario.
4. **Generación de firma:** Developer account (mnemonic) firma la key request (EIP-712, 24h de validez).
5. **Registro de signed key:** Se registra en Farcaster vía Neynar API.
6. **Aprobación de usuario:** Usuario escanea QR o hace clic en enlace Warpcast deeplink para aprobar el signer.
7. **Publicación de cast:** Backend publica cast en nombre del usuario usando el signer_uuid.

## Conceptos clave

- **Authentication:** La cuenta prueba quién es (SIWF, Privy, etc.).
- **Authorization:** La cuenta otorga privilegios a la app para actuar en su nombre (requiere autenticación previa).
- **Managed Signer:** Neynar gestiona la custodia del signer; el usuario no gestiona mnemonics ni claves privadas directamente.
- **Developer mnemonic:** Cuenta desarrollador de Farcaster (appFid) que patrocina y firma el registro de signers de usuarios.
- **Patrocinio de signers:** Neynar patrocina por defecto; el usuario paga $0 en onchain fees.
- **Warpcast deeplink:** `https://client.warpcast.com/deeplinks/signed-key-request?token=...` para aprobación móvil/escritorio.

## Notas de derechos de autor

Documentación pública de Neynar. Los conceptos, arquitectura y patrones de integración son reimplementables libremente. No se copia código literal sin atribución explícita. La documentación original permanece bajo los términos de Neynar/Mintlify.
