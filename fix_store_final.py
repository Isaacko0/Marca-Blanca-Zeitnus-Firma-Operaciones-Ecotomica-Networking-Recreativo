import sys

with open('src/core/state/store.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

# The issue is that the store.ts has inconsistent indentation in the actions section
# Let me rewrite the section from line 1570 to 1650 with consistent 48-space indentation

old_section = """                                                // ===== Happpy Offer Designer (8 niveles high-ticket) =====
                                                updateOfferDesigner: (updates: Partial<OfferDesignerOfferState>) => set((st) => ({
                                                  offerDesigner: { ...st.offerDesigner, ...updates },
                                                })),
                                                resetOfferDesigner: () => set((st) => ({
                                                  offerDesigner: makeOfferDesignerOfferState(),
                                                }))),

                                                                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====
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
                                                })),

                                                // ===== Coworkers (inspirado en OpenBot) =====
                                                addCoworker: (input) => set((st) => ({
                                                coworkers: { ...st.coworkers, coworkers: [...st.coworkers.coworkers, makeCoworker(input)] },
                                                })),
                                                toggleCoworkerHidden: (id) => set((st) => ({
                                                coworkers: {"""

new_section = """                                                // ===== Offer Designer (8 niveles high-ticket) =====
                                                updateOfferDesigner: (updates: Partial<OfferDesignerOfferState>) => set((st) => ({
                                                  offerDesigner: { ...st.offerDesigner, ...updates },
                                                })),
                                                resetOfferDesigner: () => set((st) => ({
                                                  offerDesigner: makeOfferDesignerOfferState(),
                                                })),

                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====
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
                                                })),

                                                // ===== Coworkers (inspirado en OpenBot) =====
                                                addCoworker: (input) => set((st) => ({
                                                  coworkers: { ...st.coworkers, coworkers: [...st.coworkers.coworkers, makeCoworker(input)] },
                                                })),
                                                toggleCoworkerHidden: (id) => set((st) => ({
                                                  coworkers: {"""

if old_section in content:
    new_content = content.replace(old_section, new_section)
    with open('src/core/state/store.ts', 'w', encoding='utf-8', newline='') as f:
        f.write(new_content)
    print('Fixed store.ts section!')
else:
    print('Section not found - checking...')
    # Debug
    idx = content.find('// ===== Happpy Offer Designer')
    if idx >= 0:
        print('Found at:', idx)
        print('Actual:')
        print(repr(content[idx:idx+500]))