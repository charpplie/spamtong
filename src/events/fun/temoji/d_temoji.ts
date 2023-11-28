// import { Event, Events } from '@/comx'
// import { updateLastTriggeredAt } from './temoji'

// function startDailyTimer(callback: { (): void; (): void }) {
//   const targetHour = 0
//   const targetMinute = 0

//   const timerId = setInterval(async () => {
//     const lastTriggeredAt = await updateLastTriggeredAt('daily')
//     const now = new Date()
//     const currentHour = now.getHours()
//     const currentMinute = now.getMinutes()

//     if (
//       (lastTriggeredAt && now > new Date(lastTriggeredAt)) ||
//       (!lastTriggeredAt && currentHour === targetHour && currentMinute === targetMinute)
//     ) {
//       callback()
//     }
//   }, 5000)

//   return timerId
// }

// export default {
//   name: Events.ClientReady,
//   callback: async (client) => {
//     const guild = client.guilds.cache.get(`${process.env.temoji_guild}`)
//     const channel = guild.channels.cache.get(`${process.env.temoji_channel}`)

//     const dailyTimer = startDailyTimer(async () => {
//       await channel.send('Новый день - новый новый')
//     })
//   }
// } as Event