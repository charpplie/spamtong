import { Event, Events, Constants } from 'comx'

export default {
  name: Events.ClientReady,
  callback: async (c, client) => {
    const channels = client.channels
    console.log(channels.holds())
  }
} as Event
