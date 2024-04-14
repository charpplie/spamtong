import { Event, Events } from 'index'
import { RReactsModel, setRRChanged } from 'models/guilds/randreacts'

export default {
  name: Events.ClientReady,
  callback: async (client) => {
    RReactsModel.afterSync(async () => {
      const guilds = client.guilds.cache.map((guild: any) => { return `${guild.id}` })

      for (const guild of guilds) {
        if (!(await RReactsModel.findOne({ where: { guildId: guild }}))) {
          setRRChanged(true)
          const _guild = client.guilds.cache.get(guild)
          if (!_guild) continue

          const emojis = _guild.emojis.cache.map((e: any) => { return e.animated? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>` })

          await RReactsModel.create({
            guildId: guild,
            emoji_list: emojis.join(';')
          })
        }
      }
    })
  }
} as Event