import { Event, Events } from 'comx'
import { ChannelType } from 'discord.js'
import { Sleep } from 'utils'

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default {
  name: Events.ClientReady,
  callback: async (client) => {
    const guild = client.guilds.cache.get('1150427580734906368')

    while (true) {
      const curTime = new Date()
      const timezoneOffset = -10
      const seattleTime = new Date(curTime.getTime() + timezoneOffset * 60 * 60 * 1000)
      let hours = parseInt(seattleTime.getHours().toString().padStart(2, '0'))
      const minutes = seattleTime.getMinutes().toString().padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = (hours % 12) || 12;
      const day = seattleTime.getDate()
      const channel = await guild?.channels.create({
        name: `${day} ${monthNames[seattleTime.getMonth()]}, ${hours}:${minutes} ${ampm}`,
        type: ChannelType.GuildVoice,
        parent: '1217122183898337310',
      })
      await Sleep(120000)
      ;(await channel)?.delete()
    }
  }
} as Event