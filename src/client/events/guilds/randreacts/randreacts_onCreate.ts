// import { Event, Events } from 'public/comx'
// import { RReactsModel, setRRChanged } from 'models/guilds/randreacts'

// export default {
//   name: Events.GuildCreate,
//   callback: async (client, guild) => {
//     setRRChanged(true)

//     const emojis = guild.emojis.cache.map((e: any) => { return e.animated? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>` })

//     await RReactsModel.create({
//       guildId: guild.id,
//       emoji_list: emojis.join(';')
//     })
//   }
// } as Event