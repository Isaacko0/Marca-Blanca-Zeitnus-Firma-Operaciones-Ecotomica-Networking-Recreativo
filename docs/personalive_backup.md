# PersonaLive — Backup Original

**Fuente**: https://github.com/GVCLab/PersonaLive
**Paper**: arXiv:2512.11253 (CVPR 2026)
**Licencia**: Apache-2.0
**Stack**: Python 91.2% + Svelte 3.3% + CUDA 2.8% + C++ 1.2%

## Descripción original
Framework de difusión en tiempo real y streamable para animación de retratos. Genera animaciones de longitud infinita con streaming strategy en 12GB VRAM.

## Componentes clave
- `src/` — modelos difusión (denoising UNet, motion encoder/extractor)
- `configs/` — configuración inferencia
- `pretrained_weights/` — pesos pre-entrenados
- `train_stage1/2/3.py` — entrenamiento multi-etapa
- `webcam/` — UI web
- `inference_offline.py` / `inference_online.py` — modos inferencia

## Funcionalidades principales
1. Animación de retratos en tiempo real
2. Streaming strategy (12GB VRAM)
3. Offline/online inference
4. Web UI con soporte reference image replacement
5. 3-stage training pipeline
6. TensorRT optimization

## Architecture
- Base: Stable Diffusion image variations
- Motion encoder + motion extractor
- RAIN (Recurrent Auto-Regressive Interpolation Network)
- StreamDiffusion para tiempo real
