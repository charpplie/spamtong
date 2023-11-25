// import { ChannelType, VoiceChannel } from 'discord.js'
// import { CustomClient, Event, Events } from '../comx'

// function Sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

// export default {
//   name: Events.ClientReady,
//   callback: async (client: CustomClient) => {
//     const guild = client.guilds.cache.get('1150427580734906368')
//     let channel: VoiceChannel
//     while (true) {
//       const time = new Date().toLocaleString('en-US', {
//         timeZone: 'America/Los_Angeles'
//       })
//       await guild?.channels.create({
//         name: `${time.split(', ')[0]}, ${(time.split(', ')[1]).split(':')[0]}:${(time.split(', ')[1]).split(':')[1]} ${(time.split(', ')[1]).split(' ')[1]}`,
//         type: ChannelType.GuildVoice,
//         parent: `1176149629050560553`
//       }).then(async (c) => {channel = c;await Sleep(60000);await channel.delete()})
//     }
//   }
// } as Event