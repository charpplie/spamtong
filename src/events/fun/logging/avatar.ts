import { Event, Events } from 'comx'
import { TextChannel } from 'discord.js'

const GUILD = '1150427580734906368'
const CHANNEL = '1204439974766706698'

export default {
  name: Events.UserUpdate,
  callback: async (client, Old, New) => {
    if (Old.bot) return

    if (Old.avatar !== New.avatar) {
      const guild = client.guilds.cache.get(GUILD)
      const channel = guild?.channels.cache.get(CHANNEL) as TextChannel

      await channel.send({
        content: `${new Date()} | ${New.avatar === null? `${Old.username} убрал аватар` : `${Old.avatar === null? `${Old.username} поставил аватар https://cdn.discordapp.com/avatars/${Old.id}/${New.avatar}.png` : `${Old.username} сменил аватар с https://cdn.discordapp.com/avatars/${Old.id}/${Old.avatar}.png на https://cdn.discordapp.com/avatars/${Old.id}/${New.avatar}.png` }` }`
      })
    }
  }
} as Event