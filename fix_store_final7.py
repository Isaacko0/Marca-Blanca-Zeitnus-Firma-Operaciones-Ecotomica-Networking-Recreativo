import sys

with open('src/core/state/store.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

idx_start = content.find('                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====')
idx_end = content.find('                                                // ===== Story (MuMuAINovel) =====', idx_start)

if idx_start >= 0 and idx_end >= 0:
    old_section = content[idx_start:idx_end]
    print(f'Found section, length: {len(old_section)}')
    
    new_section = (
        '                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====\r\n'
        '                                                setBoundaryPolicy: (policy) => set((st) => ({\r\n'
        '                                                  boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, ...policy } },\r\n'
        '                                                })),\r\n'
        '                                                addBoundaryRule: (list, expr) => set((st) => {\r\n'
        '                                                  if (!expr.trim()) return {}\r\n'
        '                                                  return {\r\n'
        '                                                    boundaries: {\r\n'
        '                                                      ...st.boundaries,\r\n'
        '                                                      policy: { ...st.boundaries.policy, [list]: [...st.boundaries.policy[list], expr.trim()] },\r\n'
        '                                                    },\r\n'
        '                                                  }\r\n'
        '                                                }),\r\n'
        '                                                removeBoundaryRule: (list, index) => set((st) => {\r\n'
        '                                                  const next = st.boundaries.policy[list].filter((_, i) => i !== index)\r\n'
        '                                                  return {\r\n'
        '                                                    boundaries: { ...st.boundaries, policy: { ...st.boundaries.policy, [list]: next } },\r\n'
        '                                                  }\r\n'
        '                                                }),\r\n'
        '                                                clearBoundaryAudit: () => set((st) => ({ boundaries: { ...st.boundaries, audit: [] } })),\r\n'
        '                                                logBoundaryAudit: (row) => set((st) => {\r\n'
        '                                                  const full = makeAuditRow(row)\r\n'
        '                                                  return {\r\n'
        '                                                    boundaries: { ...st.boundaries, audit: [full, ...st.boundaries.audit].slice(0, st.boundaries.maxAudit) },\r\n'
        '                                                  }\r\n'
        '                                                }),\r\n'
        '\r\n'
        '                                                // ===== Coworkers (inspirado en OpenBot) =====\r\n'
        '                                                addCoworker: (input) => set((st) => {\r\n'
        '                                                  coworkers: { ...st.coworkers, coworkers: [...st.coworkers.coworkers, makeCoworker(input)] },\r\n'
        '                                                }),\r\n'
        '                                                toggleCoworkerHidden: (id) => set((st) => {\r\n'
        '                                                  coworkers: {\r\n'
        '                                                      ...st.coworkers,\r\n'
        '                                                      coworkers: st.coworkers.coworkers.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c)),\r\n'
        '                                                  },\r\n'
        '                                                }),\r\n'
        '                                                setCoworkerControl: (id, control) => set((st) => {\r\n'
        '                                                  coworkers: {\r\n'
        '                                                      ...st.coworkers,\r\n'
        '                                                      coworkers: st.coworkers.coworkers.map((c) => (c.id === id ? { ...c, control } : c)),\r\n'
        '                                                  },\r\n'
        '                                                }),\r\n'
        '                                                startChannel: (coworkerId) => set((st) => {\r\n'
        '                                                  const ch = makeChannel(coworkerId)\r\n'
        '                                                  set((st) => ({ coworkers: { ...st.coworkers, channels: [...st.coworkers.channels, ch] } }))\r\n'
        '                                                  return ch.id\r\n'
        '                                                }),\r\n'
        '                                                postToChannel: (channelId, from, text) => set((st) => {\r\n'
        '                                                  coworkers: {\r\n'
        '                                                      ...st.coworkers,\r\n'
        '                                                      channels: st.coworkers.channels.map((ch) =>\r\n'
        '                                                        ch.id === channelId\r\n'
        '                                                          ? { ...ch, messages: [...ch.messages, { id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, from, text, ts: Date.now() }] }\r\n'
        '                                                          : ch,\r\n'
        '                                                      ),\r\n'
        '                                                  },\r\n'
        '                                                })),\r\n'
    )

    if old_section in content:
        new_content = content.replace(old_section, new_section)
        with open('src/core/state/store.ts', 'w', encoding='utf-8', newline='') as f:
            f.write(new_content)
        print('SUCCESS: store.ts fixed!')
    else:
        print('Old section not found exactly')
        idx_start = content.find('                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====')
        if idx_start >= 0:
            idx_end = content.find('                                                // ===== Story (MuMuAINovel) =====', idx_start)
            if idx_end >= 0:
                actual = content[idx_start:idx_end]
                print(f'Found section at {idx_start}-{idx_end}, length: {len(actual)}')
                print('First 300 chars:')
                print(repr(actual[:300]))
else:
    print('Start or end marker not found')