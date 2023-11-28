import { Event, Events } from '@/comx'
import { ITEmojiModel } from '@sys/temoji_db'
import { ITimerModel } from '@sys/temoji_tdb'

export async function updateLastTriggeredAt(id: string): Promise<Date | null> {
  try {
    let timer = await ITimerModel.findOne({ where: { id: id }})

    if (!timer) {
      timer = await ITimerModel.create({
        id: id,
        lastTriggeredAt: new Date()
      })
    }

    return (await timer.get('lastTriggeredAt')) as Date
  } catch (error) {
    console.error('Error updating timer model:', error)
    return null
  }
}

export function countEmojis(message: string, emojiId: string): number {
  const regex = new RegExp(`<a?:\\w+:${emojiId}>`, 'g')
  const matches = message.match(regex)

  return matches ? matches.length : 0
}

export default {
  name: Events.MessageCreate,
  callback: async (interaction) => {
    const guild = interaction.client.guilds.cache.get(`${process.env.temoji_guild}`)
    const emojis = guild.emojis.cache.map((e: any) => { return `${e}` })
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