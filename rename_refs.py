import sys, os

# Files to process
files = [
    'src/core/lib/offer-designer.ts',
    'src/core/lib/offer-designer-levels.ts',
    'src/core/lib/offer-designer-evaluator.ts',
    'src/core/state/offer-designer.ts',
    'src/core/state/hooks/offer-designer.ts',
    'src/app/screens/OfferDesigner.tsx',
    'src/app/screens/OfferDesignerCarta.tsx',
    'src/app/screens/OfferDesignerEvaluator.tsx',
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8', newline='') as f:
        content = f.read()

    # Replace imports and module references
    content = content.replace('happpy-offer', 'offer-designer')
    content = content.replace('happpy-levels', 'offer-designer-levels')
    content = content.replace('happpy-evaluator', 'offer-designer-evaluator')
    content = content.replace('@core/state/happpy', '@core/state/offer-designer')
    content = content.replace('@core/state/hooks/happpy', '@core/state/hooks/offer-designer')

    # Replace variable/function names (camelCase)
    content = content.replace('happpy', 'offerDesigner')
    content = content.replace('Happpy', 'OfferDesigner')
    content = content.replace('HAPPPY', 'OFFER_DESIGNER')

    # Replace store slice references
    content = content.replace('offerDesignerOffer', 'offerDesignerOffer')
    content = content.replace('offerDesignerUI', 'offerDesignerUI')
    content = content.replace('offerDesignerConfig', 'offerDesignerConfig')
    content = content.replace('offerDesignerEvaluation', 'offerDesignerEvaluation')
    content = content.replace('offerDesignerMigration', 'offerDesignerMigration')
    content = content.replace('offerDesignerActions', 'offerDesignerActions')
    content = content.replace('offerDesignerToasts', 'offerDesignerToasts')

    # Replace types - these should already be correct after Happpy->OfferDesigner
    # Replace function names
    content = content.replace('calculateOfferDesignerLevelPower', 'calculateOfferDesignerLevelPower')
    content = content.replace('calculateTotalOfferDesignerPower', 'calculateTotalOfferDesignerPower')
    content = content.replace('validateOfferDesignerLevel', 'validateOfferDesignerLevel')
    content = content.replace('getNextIncompleteOfferDesignerLevel', 'getNextIncompleteOfferDesignerLevel')
    content = content.replace('canAdvanceToOfferDesignerLevel', 'canAdvanceToOfferDesignerLevel')
    content = content.replace('generateOfferDesignerSalesLetter', 'generateOfferDesignerSalesLetter')
    content = content.replace('parseOfferDesignerEvaluationResponse', 'parseOfferDesignerEvaluationResponse')
    content = content.replace('migrateV1toV2OfferDesigner', 'migrateV1toV2OfferDesigner')
    content = content.replace('exportToJSONOfferDesigner', 'exportToJSONOfferDesigner')
    content = content.replace('importFromJSONOfferDesigner', 'importFromJSONOfferDesigner')
    content = content.replace('convertCurrencyOfferDesigner', 'convertCurrencyOfferDesigner')

    content = content.replace('validateOfferDesignerLevelData', 'validateOfferDesignerLevelData')
    content = content.replace('getOfferDesignerLevelProgress', 'getOfferDesignerLevelProgress')
    content = content.replace('getOfferDesignerLevelDependencies', 'getOfferDesignerLevelDependencies')
    content = content.replace('isOfferDesignerLevelUnlocked', 'isOfferDesignerLevelUnlocked')

    content = content.replace('runOfferDesignerEvaluation', 'runOfferDesignerEvaluation')
    content = content.replace('clearOfferDesignerEvaluation', 'clearOfferDesignerEvaluation')
    content = content.replace('detectV1OfferDesignerData', 'detectV1OfferDesignerData')
    content = content.replace('migrateV1ToV2OfferDesigner', 'migrateV1ToV2OfferDesigner')
    content = content.replace('dismissOfferDesignerMigration', 'dismissOfferDesignerMigration')

    content = content.replace('setOfferDesignerMode', 'setOfferDesignerMode')
    content = content.replace('setOfferDesignerPriceParity', 'setOfferDesignerPriceParity')
    content = content.replace('setOfferDesignerLanguage', 'setOfferDesignerLanguage')
    content = content.replace('setOfferDesignerEvaluatorMode', 'setOfferDesignerEvaluatorMode')

    content = content.replace('openOfferDesignerExportModal', 'openOfferDesignerExportModal')
    content = content.replace('closeOfferDesignerExportModal', 'closeOfferDesignerExportModal')
    content = content.replace('openOfferDesignerEvaluatorModal', 'openOfferDesignerEvaluatorModal')
    content = content.replace('closeOfferDesignerEvaluatorModal', 'closeOfferDesignerEvaluatorModal')
    content = content.replace('openOfferDesignerMigrationModal', 'openOfferDesignerMigrationModal')
    content = content.replace('closeOfferDesignerMigrationModal', 'closeOfferDesignerMigrationModal')

    content = content.replace('addOfferDesignerToast', 'addOfferDesignerToast')
    content = content.replace('removeOfferDesignerToast', 'removeOfferDesignerToast')
    content = content.replace('clearOfferDesignerToasts', 'clearOfferDesignerToasts')
    content = content.replace('unlockOfferDesignerAchievement', 'unlockOfferDesignerAchievement')
    content = content.replace('saveOfferDesignerToStorage', 'saveOfferDesignerToStorage')
    content = content.replace('loadOfferDesignerFromStorage', 'loadOfferDesignerFromStorage')
    content = content.replace('clearOfferDesignerStorage', 'clearOfferDesignerStorage')

    # Replace hooks
    content = content.replace('useOfferDesignerOffer', 'useOfferDesignerOffer')
    content = content.replace('useOfferDesignerUI', 'useOfferDesignerUI')
    content = content.replace('useOfferDesignerConfig', 'useOfferDesignerConfig')
    content = content.replace('useOfferDesignerEvaluation', 'useOfferDesignerEvaluation')
    content = content.replace('useOfferDesignerMigration', 'useOfferDesignerMigration')
    content = content.replace('useOfferDesignerToasts', 'useOfferDesignerToasts')
    content = content.replace('useOfferDesignerActions', 'useOfferDesignerActions')
    content = content.replace('useCurrentOfferDesignerLevel', 'useCurrentOfferDesignerLevel')
    content = content.replace('useOfferDesignerPowerBreakdown', 'useOfferDesignerPowerBreakdown')
    content = content.replace('useCompletedOfferDesignerLevels', 'useCompletedOfferDesignerLevels')
    content = content.replace('useNextOfferDesignerLevel', 'useNextOfferDesignerLevel')
    content = content.replace('useOfferDesignerProgress', 'useOfferDesignerProgress')
    content = content.replace('useUnlockedOfferDesignerLevels', 'useUnlockedOfferDesignerLevels')
    content = content.replace('useOfferDesignerSalesLetter', 'useOfferDesignerSalesLetter')
    content = content.replace('useCurrentOfferDesignerEvaluation', 'useCurrentOfferDesignerEvaluation')

    # Replace store keys
    content = content.replace('offer-designer_v2', 'offer-designer_v2')
    content = content.replace('offer-designer_v1', 'offer-designer_v1')
    content = content.replace('offer-designer_migrated_v1', 'offer-designer_migrated_v1')

    # Replace component names
    content = content.replace('OfferDesignerOffer', 'OfferDesigner')
    content = content.replace('OfferDesignerCarta', 'OfferDesignerCarta')
    content = content.replace('OfferDesignerEvaluator', 'OfferDesignerEvaluator')
    content = content.replace('OfferDesignerScreen', 'OfferDesignerScreen')

    # Replace nav route
    content = content.replace('/oferta', '/oferta')

    # Replace nav key
    content = content.replace('happpyOffer', 'offerDesigner')
    content = content.replace('offerDesignerOffer', 'offerDesigner')

    # Write back
    with open(fpath, 'w', encoding='utf-8', newline='') as f:
        f.write(content)

    print(f'Updated: {fpath}')

print('All lib/state/screen files updated!')