import sys

with open('src/core/state/store.ts', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

# Fix the postToChannel action - replace template literal with string concatenation
old_post = '''                                                postToChannel: (channelId, from, text) => set((st) => {
                                                  coworkers: {
                                                      ...st.coworkers,
                                                      channels: st.coworkers.channels.map((ch) =>
                                                        ch.id === channelId
                                                          ? { ...ch, messages: [...ch.messages, { id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, from, text, ts: Date.now() }] }
                                                          : ch,
                                                      ),
                                                  },
                                                })),'''

new_post = '''                                                postToChannel: (channelId, from, text) => set((st) => {
                                                  coworkers: {
                                                    ...st.coworkers,
                                                    channels: st.coworkers.channels.map((ch) =>
                                                      ch.id === channelId
                                                        ? { ...ch, messages: [...ch.messages, { id: 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), from, text, ts: Date.now() }] }
                                                        : ch,
                                                    ),
                                                  },
                                                })),'''

if old_post in content:
    content = content.replace(old_post, new_post)
    with open('src/core/state/store.ts', 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    print('Fixed postToChannel template literal!')
else:
    print('Old postToChannel not found')
    # Debug
    idx = content.find('postToChannel:')
    if idx >= 0:
        print('Found at:', idx)
        print(repr(content[idx:idx+300]))