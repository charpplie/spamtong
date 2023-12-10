import { Event } from '@/comx'

export default {
  name: 'messageCreate',
  callback: async (interaction) => {
    const chance = Math.floor(Math.random() * 100)
    if (chance < 17) {
      const guild = interaction.client.guilds.cache.get(`${process.env.gorshok_guild}`)
      const emojis = guild.emojis.cache.map((e: any) => { return `<:${e.name}:${e.id}>` })
      const rand_emoji = emojis[Math.floor(Math.random() * emojis.length)]
      interaction.react(rand_emoji)
    }
  }
} as Event