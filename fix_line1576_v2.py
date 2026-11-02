import sys

with open('src/core/state/store.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

# Fix line 1576: remove extra )
old1 = '                                                }))),'
new1 = '                                                })),
'
content = content.replace(old1, new1)

# Fix line 1578: comment indentation from 2 to 48 spaces
old2 = '  // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) ====='
new2 = '                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) ====='
content = content.replace(old2, new2)

with open('src/core/state/store.ts', 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print('Fixed line 1576 and comment indentation!')