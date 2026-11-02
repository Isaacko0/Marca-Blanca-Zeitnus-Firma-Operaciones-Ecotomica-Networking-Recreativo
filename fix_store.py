import sys

with open('src/core/state/store.ts', 'r', encoding='utf-8') as f:
    content = f.read()

print(f'Total length: {len(content)} chars')

INDENT = ' ' * 48
INDENT2 = ' ' * 52

old = INDENT + "// ===== RBE (Renta Básica Exponencial) =====\n" + \
      INDENT + "updateRBE: (updates: Partial<RBEState>) => set((st) => ({\n" + \
      INDENT2 + "rbe: { ...st.rbe, ...updates },\n" + \
      INDENT + "})),\n" + \
      INDENT + "resetRBE: () => set((st) => ({\n" + \
      INDENT2 + "rbe: makeRBEState(),\n" + \
      INDENT + "})),\n" + \
      "\n" + \
      INDENT + "// ===== Boundaries (policy gateway anfibio inspirado en OpenBot) ====="

new = INDENT + "// ===== RBE (Renta Básica Exponencial) =====\n" + \
      INDENT + "updateRBE: (updates: Partial<RBEState>) => set((st) => ({\n" + \
      INDENT2 + "rbe: { ...st.rbe, ...updates },\n" + \
      INDENT + "})),\n" + \
      INDENT + "resetRBE: () => set((st) => ({\n" + \
      INDENT2 + "rbe: makeRBEState(),\n" + \
      INDENT + "})),\n" + \
      "\n" + \
      INDENT + "// ===== Happpy Offer Designer (8 niveles high-ticket) =====\n" + \
      INDENT + "updateHapppy: (updates: Partial<HapppyOfferState>) => set((st) => ({\n" + \
      INDENT2 + "happpy: { ...st.happpy, ...updates },\n" + \
      INDENT + "})),\n" + \
      INDENT + "resetHapppy: () => set((st) => ({\n" + \
      INDENT2 + "happpy: makeHapppyOfferState(),\n" + \
      INDENT + "})),\n" + \
      "\n" + \
      INDENT + "// ===== Boundaries (policy gateway anfibio inspirado en OpenBot) ====="

if old in content:
    print("EXACT MATCH FOUND!")
    new_content = content.replace(old, new)
    with open('src/core/state/store.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS - File written!")
else:
    print("NOT FOUND - debug")
    idx = content.find('// ===== RBE (Renta B')
    idx2 = content.find('// ===== RBE (Renta B', idx+1)
    if idx2 >= 0:
        bound_idx = content.find('// ===== Boundaries', idx2)
        actual = content[idx2:bound_idx]
        print("ACTUAL LENGTH:", len(actual))
        print("OLD LENGTH:", len(old))
        # Show diff
        for i, (a, b) in enumerate(zip(actual, old)):
            if a != b:
                print(f"DIFF at pos {i}: actual={repr(a)} vs expected={repr(b)}")
                break
        else:
            if len(actual) != len(old):
                print(f"Length mismatch: actual={len(actual)} old={len(old)}")