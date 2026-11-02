import sys

with open('src/core/state/store.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

old_impl = '''postToChannel: (channelId, from, text) => set((st) => {
                                                  coworkers: {
                                                      ...st.coworkers,
                                                      channels: st.coworkers.channels.map((ch) =>
                                                        ch.id === channelId
                                                          ? { ...ch, messages: [...ch.messages, { id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, from, text, ts: Date.now() }] }
                                                          : ch,
                                                      ),
                                                  },
                                                })),'''

new_impl = '''postToChannel: (channelId, from, text) => set((st) => {
                                                  coworkers: {
                                                    ...st.coworkers,
                                                    channels: st.coworkers.channels.map((ch) =>
                                                      ch.id === channelId
                                                        ? { ...ch, messages: [...ch.messages, { id: 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), from, text, ts: Date.now() }] }
                                                        : ch,
                                                    ),
                                                  },
                                                })),'''

if old_impl in content:
    content = content.replace(old_impl, new_impl)
    with open('src/core/state/store.ts', 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    print('SUCCESS: Fixed postToChannel template literal!')
else:
    print('Old implementation not found')
    idx = content.find('postToChannel:')
    if idx >= 0:
        print('Found at:', idx)
        print('Context:', repr(content[idx:idx+300]))