import sys

with open('docs/happpy_offer_designer_backup.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all proprietary references
content = content.replace('Offfer Designer · Happpy.World', 'Offer Designer (referencia asimilada)')
content = content.replace('https://ofertas.happpy.world/', 'https://ofertas.happpy.world/ (referencia asimilada)')
content = content.replace('sha256:happpy-offer-designer-20261029', 'sha256:offer-designer-20261029')
content = content.replace('Offfer Designer', 'Offer Designer')
content = content.replace('happpy_offer_v1', 'offer_designer_v1')
content = content.replace('happpy-offer-designer', 'offer-designer')

with open('docs/happpy_offer_designer_backup.md', 'w', encoding='utf-8') as f:
    f.write(content)
print('backup.md updated!')