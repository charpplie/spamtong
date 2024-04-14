import { Event, Events } from 'comx'
import { joinVoiceChannel } from '@discordjs/voice';

export default { 
  name: Events.ClientReady,
  callback: async (client) => {
    const guild = client.guilds.cache.get('1150427580734906368')
    if (!guild) return
    const connection = joinVoiceChannel({
      channelId: '1150427581296935007',
      guildId: '1150427580734906368',
      adapterCreator: guild.voiceAdapterCreator,
    });
  }
} as Event