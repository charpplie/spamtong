import { Event, Events, Constants } from 'comx'

export default {
  name: Events.ClientReady,
  callback: async (c, client) => {
    const channels = client.channels.values()
    console.log(channels)
  }
} as Event
