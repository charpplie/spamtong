import { Event, Events } from '@/comx'

export default {
  name: Events.MessageCreate,
  callback: async (interaction) => {
    const chance = Math.floor(Math.random() * 100)
    if (chance < 23) {
      const guild = interaction.client.guilds.cache.get(`${process.env.gorshok_guild}`)
      const emojis = guild.emojis.cache.map((e: any) => { return `${e}` })
      const rand_emoji = emojis[Math.floor(Math.random() * emojis.length)]
      interaction.react(rand_emoji)
    }
  }
} as Event