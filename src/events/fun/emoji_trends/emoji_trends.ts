import { Event, Events } from 'comx'
import { ITEmojiModel } from 'models/emoji_trends'

export function countEmojis(message: string, emojiId: string): number {
  const regex = new RegExp(`<a?:\\w+:${emojiId}>`, 'g')
  const matches = message.match(regex)

  return matches ? matches.length : 0
}

const GUILD = '1150427580734906368'

export default {
  name: Events.MessageCreate,
  callback: async (client, interaction) => {
    const guild = interaction.client.guilds.cache.get(GUILD)
    const emojis = guild.emojis.cache.map((e: any) => { return `${e.animated? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>` }` })
    const emojis_ids = guild.emojis.cache.map((e: any) => { return `${e.id}` })
    for (let i = 0; i < emojis.length; i++) {
      if (countEmojis(interaction.content, emojis_ids[i])) {
        const emoji = await ITEmojiModel.findOne({ where: { emoji: emojis[i] }})
        if (emoji) {
          emoji.increment('daily_usage')
          emoji.increment('weekly_usage')
          emoji.increment('monthly_usage')
        }
      }
    }
  },
} as Event