import sys

with open('src/core/state/store.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

# The issue: Boundary actions have 6 spaces instead of 48 spaces
old_block = """                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====
      setBoundaryPolicy: (policy) => set((st) => ({
        boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, ...policy } },
      })),
      addBoundaryRule: (list, expr) => set((st) => ({
        if (!expr.trim()) return {}
        return {
          boundaries: {
            ...st.boundaries,
            policy: { ...st.boundaries.policy, [list]: [...st.boundaries.policy[list], expr.trim()] },
          },
        }
      })),
      removeBoundaryRule: (list, index) => set((st) => ({
        const next = st.boundaries.policy[list].filter((_, i) => i !== index)
        return {
          boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, [list]: next } },
        }
      })),
      clearBoundaryAudit: () => set((st) => ({ boundaries: { ...st.boundaries, audit: [] } })),
      logBoundaryAudit: (row) => set((st) => ({
        const full = makeAuditRow(row)
        return {
          boundaries: { ...st.boundaries, audit: [full, ...st.boundaries.audit].slice(0, st.boundaries.maxAudit) },
        }
      })),"""

new_block = """                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====
                                                setBoundaryPolicy: (policy) => set((st) => ({
                                                  boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, ...policy } },
                                                })),
                                                addBoundaryRule: (list, expr) => set((st) => ({
                                                  if (!expr.trim()) return {}
                                                  return {
                                                    boundaries: {
                                                      ...st.boundaries,
                                                      policy: { ...st.boundaries.policy, [list]: [...st.boundaries.policy[list], expr.trim()] },
                                                    },
                                                  }
                                                })),
                                                removeBoundaryRule: (list, index) => set((st) => ({
                                                  const next = st.boundaries.policy[list].filter((_, i) => i !== index)
                                                  return {
                                                    boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, [list]: next } },
                                                  }
                                                })),
                                                clearBoundaryAudit: () => set((st) => ({ boundaries: { ...st.boundaries, audit: [] } })),
                                                logBoundaryAudit: (row) => set((st) => ({
                                                  const full = makeAuditRow(row)
                                                  return {
                                                    boundaries: { ...st.boundaries, audit: [full, ...st.boundaries.audit].slice(0, st.boundaries.maxAudit) },
                                                  }
                                                })),"""

if old_block in content:
    new_content = content.replace(old_block, new_block)
    with open('src/core/state/store.ts', 'w', encoding='utf-8', newline='') as f:
        f.write(new_content)
    print('Fixed!')
else:
    print('Block not found')
    # Debug
    idx = content.find('// ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====')
    if idx >= 0:
        actual = content[idx:idx+1500]
        print('Found at:', idx)
        # Show with visible indentation
        for i, line in enumerate(actual.split('\n')[:20]):
            spaces = len(line) - len(line.lstrip())
            print(f'{spaces:3} spaces: {repr(line[:80])}')