import sys

with open('src/core/state/store.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

# Find the exact section to replace
idx_start = content.find('                                                // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====')
idx_end = content.find('                                                // ===== Story (MuMuAINovel) =====', idx_start)

if idx_start >= 0 and idx_end >= 0:
    old_section = content[idx_start:idx_end]
    print(f'Found section, length: {len(old_section)}')
    
    # New section with correct 2-space indentation for declarations
    new_section = '''  // ===== Boundaries (policy gateway anfibio inspirado en OpenBot) =====
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
    coworkers: {
      ...st.coworkers,
      coworkers: st.coworkers.coworkers.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c)),
    },
  })),
  setCoworkerControl: (id, control) => set((st) => ({
    coworkers: {
      ...st.coworkers,
      coworkers: st.coworkers.coworkers.map((c) => (c.id === id ? { ...c, control } : c)),
    },
  })),
  startChannel: (coworkerId) => {
    const ch = makeChannel(coworkerId)
    set((st) => ({ coworkers: { ...st.coworkers, channels: [...st.coworkers.channels, ch] } }))
    return ch.id
  },
  postToChannel: (channelId, from, text) => set((st) => ({
    coworkers: {
      ...st.coworkers,
      channels: st.coworkers.channels.map((ch) =>
        ch.id === channelId
          ? { ...ch, messages: [...ch.messages, { id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, from, text, ts: Date.now() }] }
        : ch,
      ),
    },
  })),''

    if old_section in content:
        print('Found exact match!')
        new_content = content.replace(old_section, new_section)
        with open('src/core/state/store.ts', 'w', encoding='utf-8', newline='') as f:
            f.write(new_content)
        print('SUCCESS: store.ts fixed!')
    else:
        print('Old section not found exactly, trying to find it...')
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