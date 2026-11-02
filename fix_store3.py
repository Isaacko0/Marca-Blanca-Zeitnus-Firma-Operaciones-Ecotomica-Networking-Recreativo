import sys

with open('src/core/state/store.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

# The file uses CRLF and 6-space indentation for actions
CRLF = '\r\n'
INDENT6 = '      '
INDENT8 = '        '
INDENT10 = '          '
INDENT12 = '            '

old_block = (
    '// ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====' + CRLF +
    '      setBoundaryPolicy: (policy) => set((st) => ({' + CRLF +
    '        boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, ...policy } },' + CRLF +
    '      })),' + CRLF +
    '      addBoundaryRule: (list, expr) => set((st) => ({' + CRLF +
    '        if (!expr.trim()) return {}' + CRLF +
    '        return {' + CRLF +
    '          boundaries: {' + CRLF +
    '            ...st.boundaries,' + CRLF +
    '            policy: { ...st.boundaries.policy, [list]: [...st.boundaries.policy[list], expr.trim()] },' + CRLF +
    '          },' + CRLF +
    '        }' + CRLF +
    '      })),' + CRLF +
    '      removeBoundaryRule: (list, index) => set((st) => ({' + CRLF +
    '        const next = st.boundaries.policy[list].filter((_, i) => i !== index)' + CRLF +
    '        return {' + CRLF +
    '          boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, [list]: next } },' + CRLF +
    '        }' + CRLF +
    '      })),' + CRLF +
    '      clearBoundaryAudit: () => set((st) => ({ boundaries: { ...st.boundaries, audit: [] } })),' + CRLF +
    '      logBoundaryAudit: (row) => set((st) => {' + CRLF +
    '        const full = makeAuditRow(row)' + CRLF +
    '        return {' + CRLF +
    '          boundaries: { ...st.boundaries, audit: [full, ...st.boundaries.audit].slice(0, st.boundaries.maxAudit) },' + CRLF +
    '        }' + CRLF +
    '      }),' + CRLF
)

new_block = (
    '                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====' + CRLF +
    '                                                setBoundaryPolicy: (policy) => set((st) => ({' + CRLF +
    '                                                  boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, ...policy } },' + CRLF +
    '                                                })),' + CRLF +
    '                                                addBoundaryRule: (list, expr) => set((st) => ({' + CRLF +
    '                                                  if (!expr.trim()) return {}' + CRLF +
    '                                                  return {' + CRLF +
    '                                                    boundaries: {' + CRLF +
    '                                                      ...st.boundaries,' + CRLF +
    '                                                      policy: { ...st.boundaries.policy, [list]: [...st.boundaries.policy[list], expr.trim()] },' + CRLF +
    '                                                    },' + CRLF +
    '                                                  }' + CRLF +
    '                                                }),' + CRLF +
    '                                                removeBoundaryRule: (list, index) => set((st) => ({' + CRLF +
    '                                                  const next = st.boundaries.policy[list].filter((_, i) => i !== index)' + CRLF +
    '                                                  return {' + CRLF +
    '                                                    boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, [list]: next } },' + CRLF +
    '                                                  }' + CRLF +
    '                                                }),' + CRLF +
    '                                                clearBoundaryAudit: () => set((st) => ({ boundaries: { ...st.boundaries, audit: [] } })),' + CRLF +
    '                                                logBoundaryAudit: (row) => set((st) => ({' + CRLF +
    '                                                  const full = makeAuditRow(row)' + CRLF +
    '                                                  return {' + CRLF +
    '                                                    boundaries: { ...st.boundaries, audit: [full, ...st.boundaries.audit].slice(0, st.boundaries.maxAudit) },' + CRLF +
    '                                                  }' + CRLF +
    '                                                })),' + CRLF
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
    print('Block not found')
    # Show what we're looking for
    idx = content.find('// ===== Boundaries (policy gateway')
    if idx >= 0:
        print('Found at:', idx)
        print('First 500 chars of actual:')
        print(repr(content[idx:idx+1000]))