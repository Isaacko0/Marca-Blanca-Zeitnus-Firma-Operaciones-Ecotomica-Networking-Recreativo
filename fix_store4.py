import sys

with open('src/core/state/store.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

# The file uses literal \r\n (two chars) for newlines
old_block = (
    '// ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====\r\n'
    '      setBoundaryPolicy: (policy) => set((st) => ({\r\n'
    '        boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, ...policy } },\r\n'
    '      })),\r\n'
    '      addBoundaryRule: (list, expr) => set((st) => ({\r\n'
    '        if (!expr.trim()) return {}\r\n'
    '        return {\r\n'
    '          boundaries: {\r\n'
    '            ...st.boundaries,\r\n'
    '            policy: { ...st.boundaries.policy, [list]: [...st.boundaries.policy[list], expr.trim()] },\r\n'
    '          },\r\n'
    '        }\r\n'
    '      })),\r\n'
    '      removeBoundaryRule: (list, index) => set((st) => ({\r\n'
    '        const next = st.boundaries.policy[list].filter((_, i) => i !== index)\r\n'
    '        return {\r\n'
    '          boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, [list]: next } },\r\n'
    '        }\r\n'
    '      })),\r\n'
    '      clearBoundaryAudit: () => set((st) => ({ boundaries: { ...st.boundaries, audit: [] } })),\r\n'
    '      logBoundaryAudit: (row) => set((st) => ({\r\n'
    '        const full = makeAuditRow(row)\r\n'
    '        return {\r\n'
    '          boundaries: { ...st.boundaries, audit: [full, ...st.boundaries.audit].slice(0, st.boundaries.maxAudit) },\r\n'
    '        }\r\n'
    '      })),\r\n'
)

new_block = (
    '                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====\r\n'
    '                                                setBoundaryPolicy: (policy) => set((st) => ({\r\n'
    '                                                  boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, ...policy } },\r\n'
    '                                                }),\r\n'
    '                                                addBoundaryRule: (list, expr) => set((st) => ({\r\n'
    '                                                  if (!expr.trim()) return {}\r\n'
    '                                                  return {\r\n'
    '                                                    boundaries: {\r\n'
    '                                                      ...st.boundaries,\r\n'
    '                                                      policy: { ...st.boundaries.policy, [list]: [...st.boundaries.policy[list], expr.trim()] },\r\n'
    '                                                    },\r\n'
    '                                                  }\r\n'
    '                                                })),\r\n'
    '                                                removeBoundaryRule: (list, index) => set((st) => ({\r\n'
    '                                                  const next = st.boundaries.policy[list].filter((_, i) => i !== index)\r\n'
    '                                                  return {\r\n'
    '                                                    boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, [list]: next } },\r\n'
    '                                                  }\r\n'
    '                                                })),\r\n'
    '                                                clearBoundaryAudit: () => set((st) => ({ boundaries: { ...st.boundaries, audit: [] } })),\r\n'
    '                                                logBoundaryAudit: (row) => set((st) => ({\r\n'
    '                                                  const full = makeAuditRow(row)\r\n'
    '                                                  return {\r\n'
    '                                                    boundaries: { ...st.boundaries, audit: [full, ...st.boundaries.audit].slice(0, st.boundaries.maxAudit) },\r\n'
    '                                                  }\r\n'
    '                                                })),\r\n'
)

with open('src/core/state/store.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

if old_block in content:
    print('Block found!')
    new_content = content.replace(old_block, new_block)
    with open('src/core/state/store.ts', 'w', encoding='utf-8', newline='') as f:
        f.write(new_content)
    print('Fixed!')
else:
    print('Block not found - debugging...')
    idx = content.find('// ===== Boundaries (policy gateway')
    if idx >= 0:
        actual = content[idx:idx+2000]
        print('Actual first 500 chars:')
        print(repr(actual[:500]))
        print('Expected first 500 chars:')
        print(repr(old_block[:500]))