import sys

with open('src/core/lib/i18n.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

# Add nav key after nav.agingControl
old_nav = "'nav.agingControl': { es: 'Control Envejecimiento', en: 'Aging Control', pt: 'Controle Envelhecimento' },"
new_nav = old_nav + "\n  'nav.offerDesigner': { es: 'Dise\u00f1ador Ofertas', en: 'Offer Designer', pt: 'Designer de Ofertas' },"
content = content.replace(old_nav, new_nav)

# Add title key after title.agingControl
old_title = "'title.agingControl': { es: 'Control Envejecimiento', en: 'Aging Control', pt: 'Controle Envelhecimento' },"
new_title = old_title + "\n  'title.offerDesigner': { es: 'Dise\u00f1ador de Ofertas', en: 'Offer Designer', pt: 'Designer de Ofertas' },"
content = content.replace(old_title, new_title)

# Add offerDesigner specific keys at the end of the dict (before closing brace)
offer_keys = '''

  // Offer Designer (8 niveles)
  'offerDesigner.power': { es: 'Poder de la oferta', en: 'Offer Power', pt: 'Poder da oferta' },
  'offerDesigner.power.draft': { es: 'Borrador', en: 'Draft', pt: 'Rascunho' },
  'offerDesigner.power.progress': { es: 'En progreso', en: 'In Progress', pt: 'Em Progresso' },
  'offerDesigner.power.solid': { es: 'S\u00f3lida', en: 'Solid', pt: 'S\u00f3lida' },
  'offerDesigner.power.ready': { es: 'Lista para lanzar', en: 'Ready to Launch', pt: 'Pronta para Lan\u00e7ar' },
  'offerDesigner.carta.title': { es: 'Tu Carta de Venta', en: 'Your Sales Letter', pt: 'Sua Carta de Venda' },
  'offerDesigner.carta.copy': { es: 'Copiar al portapapeles', en: 'Copy to Clipboard', pt: 'Copiar para \u00c1rea de Transfer\u00eancia' },
  'offerDesigner.carta.download': { es: 'Descargar Markdown', en: 'Download Markdown', pt: 'Baixar Markdown' },
  'offerDesigner.carta.exportJson': { es: 'Exportar JSON', en: 'Export JSON', pt: 'Exportar JSON' },
  'offerDesigner.carta.warning': { es: 'Tu oferta necesita m\u00e1s trabajo. Completa los niveles pendientes.', en: 'Your offer needs more work. Complete pending levels.', pt: 'Sua oferta precisa de mais trabalho. Complete os n\u00edveis pendentes.' },
  'offerDesigner.evaluator.title': { es: 'Evaluador IA de Ofertas', en: 'AI Offer Evaluator', pt: 'Avaliador IA de Ofertas' },
  'offerDesigner.evaluator.config': { es: 'Configuraci\u00f3n del Evaluador', en: 'Evaluator Configuration', pt: 'Configura\u00e7\u00e3o do Avaliador' },
  'offerDesigner.evaluator.mode': { es: 'Modo de evaluaci\u00f3n', en: 'Evaluation Mode', pt: 'Modo de Avalia\u00e7\u00e3o' },
  'offerDesigner.evaluator.mock': { es: 'Mock (Offline - Sin API key)', en: 'Mock (Offline - No API key)', pt: 'Mock (Offline - Sem API key)' },
  'offerDesigner.evaluator.claude': { es: 'Claude (Requiere API key)', en: 'Claude (Requires API key)', pt: 'Claude (Requer API key)' },
  'offerDesigner.evaluator.openai': { es: 'OpenAI GPT-4o (Requiere API key)', en: 'OpenAI GPT-4o (Requires API key)', pt: 'OpenAI GPT-4o (Requer API key)' },
  'offerDesigner.evaluator.local': { es: 'Local LLM (Ollama/LM Studio)', en: 'Local LLM (Ollama/LM Studio)', pt: 'Local LLM (Ollama/LM Studio)' },
  'offerDesigner.evaluator.apiKey': { es: 'API Key', en: 'API Key', pt: 'API Key' },
  'offerDesigner.evaluator.showKey': { es: 'Ocultar', en: 'Hide', pt: 'Ocultar' },
  'offerDesigner.evaluator.hideKey': { es: 'Mostrar', en: 'Show', pt: 'Mostrar' },
  'offerDesigner.evaluator.hint': { es: 'La key se guarda en localStorage (solo en este navegador).', en: 'Key stored in localStorage (this browser only).', pt: 'Key salva no localStorage (apenas este navegador).' },
  'offerDesigner.evaluator.monetaryMode': { es: 'Modo monetario de la oferta', en: 'Offer Monetary Mode', pt: 'Modo Monet\u00e1rio da Oferta' },
  'offerDesigner.evaluator.postmonetario': { es: 'Postmonetario (ZNU/CaaS)', en: 'Postmonetary (ZNU/CaaS)', pt: 'P\u00f3s-monet\u00e1rio (ZNU/CaaS)' },
  'offerDesigner.evaluator.conectado': { es: 'Conectado (USD/USDC v\u00eda priceParity)', en: 'Connected (USD/USDC via priceParity)', pt: 'Conectado (USD/USDC via priceParity)' },
  'offerDesigner.evaluator.run': { es: 'Evaluar Oferta', en: 'Evaluate Offer', pt: 'Avaliar Oferta' },
  'offerDesigner.evaluator.running': { es: 'Evaluando...', en: 'Evaluating...', pt: 'Avaliando...' },
  'offerDesigner.evaluator.error': { es: 'Error:', en: 'Error:', pt: 'Erro:' },
  'offerDesigner.export.title': { es: 'Exportar Carta de Venta', en: 'Export Sales Letter', pt: 'Exportar Carta de Venda' },
  'offerDesigner.export.format': { es: 'Formato de exportaci\u00f3n', en: 'Export Format', pt: 'Formato de Exporta\u00e7\u00e3o' },
  'offerDesigner.export.markdown': { es: 'Markdown (recomendado para IA)', en: 'Markdown (recommended for AI)', pt: 'Markdown (recomendado para IA)' },
  'offerDesigner.export.text': { es: 'Texto plano', en: 'Plain Text', pt: 'Texto Simples' },
  'offerDesigner.export.json': { es: 'JSON (para importar)', en: 'JSON (for import)', pt: 'JSON (para importar)' },
  'offerDesigner.export.preview': { es: 'Vista previa', en: 'Preview', pt: 'Visualiza\u00e7\u00e3o' },
  'offerDesigner.export.close': { es: 'Cerrar', en: 'Close', pt: 'Fechar' },
  'offerDesigner.export.copy': { es: 'Copiar al portapapeles', en: 'Copy to Clipboard', pt: 'Copiar para \u00c1rea de Transfer\u00eancia' },
  'offerDesigner.migration.title': { es: 'Migraci\u00f3n v1 \u2192 v2', en: 'Migration v1 \u2192 v2', pt: 'Migra\u00e7\u00e3o v1 \u2192 v2' },
  'offerDesigner.migration.desc': { es: 'Se detect\u00f3 una oferta guardada en la versi\u00f3n 1. Ingresa tu ID de usuario para migrarla a la versi\u00f3n 2:', en: 'A v1 offer was detected. Enter your user ID to migrate to v2:', pt: 'Uma oferta v1 foi detectada. Insira seu user ID para migrar para v2:' },
  'offerDesigner.migration.userId': { es: 'Tu user ID (ej: isaacko0)', en: 'Your user ID (e.g. isaacko0)', pt: 'Seu user ID (ex: isaacko0)' },
  'offerDesigner.migration.dismiss': { es: 'Descartar migraci\u00f3n', en: 'Dismiss Migration', pt: 'Descartar Migra\u00e7\u00e3o' },
  'offerDesigner.migration.cancel': { es: 'Cancelar', en: 'Cancel', pt: 'Cancelar' },
  'offerDesigner.migration.migrate': { es: 'Migrar a v2', en: 'Migrate to v2', pt: 'Migrar para v2' },
  'offerDesigner.migration.running': { es: 'Migrando...', en: 'Migrating...', pt: 'Migrando...' },
  'offerDesigner.toast.success': { es: 'Éxito', en: 'Success', pt: 'Sucesso' },
  'offerDesigner.toast.error': { es: 'Error', en: 'Error', pt: 'Erro' },
  'offerDesigner.toast.info': { es: 'Info', en: 'Info', pt: 'Info' },
  'offerDesigner.toast.achievement': { es: 'Logro desbloqueado', en: 'Achievement Unlocked', pt: 'Conquista Desbloqueada' },
  'offerDesigner.toast.close': { es: 'Cerrar', en: 'Close', pt: 'Fechar' },
  'offerDesigner.achievement.first_level': { es: 'Primer Paso', en: 'First Step', pt: 'Primeiro Passo' },
  'offerDesigner.achievement.half_way': { es: 'A Mitad de Camino', en: 'Halfway There', pt: 'Meio do Caminho' },
  'offerDesigner.achievement.all_levels': { es: 'Arquitecto de Ofertas', en: 'Offer Architect', pt: 'Arquiteto de Ofertas' },
  'offerDesigner.achievement.power_50': { es: 'Potencia Media', en: 'Medium Power', pt: 'Pot\u00eancia M\u00e9dia' },
  'offerDesigner.achievement.power_85': { es: 'Oferta S\u00f3lida', en: 'Solid Offer', pt: 'Oferta S\u00f3lida' },
  'offerDesigner.achievement.power_100': { es: 'Lista para Lanzar', en: 'Ready to Launch', pt: 'Pronta para Lan\u00e7ar' },
  'offerDesigner.achievement.first_export': { es: 'Primera Exportaci\u00f3n', en: 'First Export', pt: 'Primeira Exporta\u00e7\u00e3o' },
  'offerDesigner.achievement.first_evaluation': { es: 'Evaluada por IA', en: 'Evaluated by AI', pt: 'Avaliada por IA' },
  'offerDesigner.achievement.evaluation_a': { es: 'Calificaci\u00f3n A', en: 'Grade A', pt: 'Nota A' },
  'offerDesigner.achievement.migrated_v1': { es: 'Migrante V1', en: 'V1 Migrant', pt: 'Migrante V1' },
  'offerDesigner.achievement.mode_connected': { es: 'Modo Conectado', en: 'Connected Mode', pt: 'Modo Conectado' },
'''

# Insert before the closing }
content = content.replace('}', offer_keys + '\n}')

with open('src/core/lib/i18n.ts', 'w', encoding='utf-8', newline='') as f:
    f.write(content)
print('i18n.ts updated!')