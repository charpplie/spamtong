import { Event, Events, Constants } from 'comx'

export default {
  name: Events.ClientReady,
  callback: async (c, client) => {
    client.channels.cache.forEach(channel => {
      console.log(channel)
        if (channel.isDMBased()) {
            console.log(`DM Channel with ${channel.recipient?.tag || 'Unknown User'} (${channel.id})`);
        }
    });
  }
} as Event
