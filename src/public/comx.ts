import { CUtils } from './classes/utils'

export const Utils = new CUtils()

export const Constants = {
  vcont_channels: ['1181427849303965768'],
  vcont_reacts: [
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    // '⭐',
  ],
  icont: [
    {
      guildId: '1150427580734906368',
      channelId: '1177374466448302180',
      users: [
        {
          id: '255594607'
        },
      ]
    }
  ],
  icont_album: '-15',
  gcont: [
    {
      guild: '1150427580734906368',
      channel: '1220325347699195965',
      groups: [
        {
          id: '135729590'
        },
      ]
    },
  ],
  funlog_guild: '1150427580734906368',
  funlog_channel: '1204439974766706698',
  copyright: 'xyerssisya (C) 2021-2024. All kromers reserved.'
}

export { Command } from './structures/command'
export { Event, Events } from './structures/event'