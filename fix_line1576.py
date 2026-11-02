import sys

with open('src/core/state/store.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

# Fix line 1576: remove extra )
content = content.replace(
    '                                                }))),',
    '                                                })),
'
)

# Fix line 1578: comment indentation from 2 to 48 spaces
content = content.replace(
    '  // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====',
    '                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) ====='
)

with open('src/core/state/store.ts', 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print('Fixed line 1576 and comment indentation!')