# Integración: Neynar Managed Signers ↔ HSCSG/ALRAC

**Fuente:** https://docs.neynar.com/llms.txt y guía "Write Data with Managed Signers"  
**Autor/Empresa:** Neynar  
**Licencia:** Documentación pública (conceptos y arquitectura reimplementables; sin copia literal de código sin atribución)  
**Estado:** Fase 1 de asimilación (documentación de integración)  
**Fecha:** 2026-10-28

## Resumen

Neynar Managed Signers permite a una aplicación Next.js escribir en el protocolo Farcaster gestionando signers en nombre de usuarios. El flujo combina autenticación (SIWF/Privy) con autorización (signer gestionado por Neynar) para publicar casts en Farcaster sin que el usuario gestione claves privadas ni pague onchain fees (patrocinio por defecto de Neynar).

Este documento mapea los patrones técnicos de Neynar a las capas arquitectónicas ALRAC/HSCSG, sirviendo de base para la especificación OpenSpec correspondiente.

## Mapeo de conceptos a capas ALRAC/HSCSG

| Concepto Neynar/Farcaster | Contraparte HSCSG/ALRAC | Capa ALRAC | Fundamento arquitectónico |
|---|---|---|---|
| Farcaster protocolo (red social descentralizada) | Protocolo social soberano, Capa 2 interoperabilidad | Capa 2 | ValueFlows, DTN, contribución verificable |
| Neynar Managed Signer | Identidad soberana delegada (RAO/sCoRe), custodia compartida | Capa 2 | Identidad soberana con delegación de firma |
| SIWF / Privy (autenticación) | Autenticación soberana, DID, verificación de identidad | Capa 2 | Procedencia, emisor, permiso (RAO) |
| Autorización (app actúa en nombre de usuario) | Delegación líquida, Automaton SOUL, stake ZNU | Capa 0 | Corteza prefrontal programable, delegación de poder |
| Publish cast (mensaje en protocolo social) | Transmisión de mensaje/valor en red social soberana | Capa 4 | Contribución verificable (CaaS stream) |
| Developer mnemonic (appFid, patrocina signers) | Cuenta desarrollador, stake ZNU, nodo operador | Capa 3 | Membrana fiat/ZEITNUS, puente a onchain |
| Neynar patrocina onchain fees ($0 usuario) | Subsidio de nodo, cobertura de costos de transacción | Capa 3 | Membrana fiat, puente USDC/ReFi Nivel 3 |
| QR / Warpcast deeplink para aprobación | Interfaz de aprobación soberana, consentimiento verificable | Capa 4 | UI de consentimiento, firma criptográfica |
| API routes signer/cast | Endpoints de API para operaciones sociales | Capa 4 | API soberana, escritura controlada |
| EIP-712 signature (24h validez) | Firma criptográfica con deadline, límites temporales | Capa 2 | Criptografía como sistema inmune del santuario |

## Reglas de negocio identificadas

1. **Autenticación antes que autorización:** Primero se prueba la identidad (SIWF/Privy), luego se otorga permiso para actuar en nombre de la cuenta.
2. **El usuario no gestiona claves privadas:** Neynar gestiona la custodia del signer; el usuario solo aprueba vía QR/deeplink.
3. **Developer account patrocina:** La cuenta de desarrollador (mnemonic) firma el registro de signers de usuarios y cubre onchain fees (o Neynar los patrocina).
4. **Firma con deadline:** Cada firma EIP-712 tiene un deadline (24h por defecto); expira si no se usa.
5. **Signer aprobado por usuario:** El signed key queda `pending_approval` hasta que el usuario lo aprueba en Warpcast.
6. **Write access controlado:** Solo se puede publicar cast con un signer_uuid válido y aprobado.

## Especificaciones OpenSpec sugeridas

- `alrac-neynar-managed-signers.md` — este documento de arquitectura
- `alrac-social-protocol-signer.md` — especificación de signer gestionado para protocolo social soberano (Farcaster-like)
- `alrac-signer-delegation.md` — especificación de delegación de firma como Automaton SOUL + stake ZNU

## Referencias

- https://docs.neynar.com/llms.txt — Índice de documentación Neynar
- https://docs.neynar.com/docs/write-data-with-managed-signers — Guía completa (origen de esta asimilación)
- https://github.com/neynarxyz/farcaster-examples/tree/main/managed-signers — Repositorio de ejemplo
- https://docs.neynar.com/docs/two-ways-to-sponsor-a-farcaster-signer-via-neynar.md — Patrocinio de signers
- Repo Zeitnus: github.com/Isaacko0/Marca-Blanca-Zeitnus-Firma-Operaciones-Ecotomica-Networking-Recreativo (MIT)

## Principio rector

El código es territorio. La documentación es mapa. La verdad es el territorio. E=V.
