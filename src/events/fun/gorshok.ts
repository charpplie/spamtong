import { Event } from '@/comx'

export default {
  name: 'gorshok',
  type: 'messageCreate',
  callback: async (interaction) => {
    const chance = Math.floor(Math.random() * 100)

    if (chance < 23) {
      const guild = interaction.client.guilds.cache.get(`${process.env.gorshok_guild}`)
      const emojis = guild.emojis.cache.map((e: any) => { return `<:${e.name}:${e.id}>` })
      if (emojis.includes(interaction.content)) {
        const chance = Math.floor(Math.random() * 100)
        if (chance < 47) {
          const regex: RegExp = /<:[^>]+>/g
          const matches: string[] = interaction.content.match(regex) || []
          const emoji = matches[Math.floor(Math.random() * matches.length)]
          console.log(emoji)
          interaction.react(emoji)
        } else {
          const rand_emoji = emojis[Math.floor(Math.random() * emojis.length)]
          interaction.react(rand_emoji)
        }
      } else {
        const rand_emoji = emojis[Math.floor(Math.random() * emojis.length)]
        interaction.react(rand_emoji)
      }
    }
  }
} as Event