import { Event, Events } from 'index'
import { RReactsModel, setRRChanged } from 'models/guilds/randreacts'

export default {
  name: Events.GuildDelete,
  callback: async (client, guild) => {
    if (await RReactsModel.findOne({ where: { guildId: guild.id }})) {
      setRRChanged(true)
      await RReactsModel.destroy({ where: { guildId: guild.id }})
    }
  }
} as Event