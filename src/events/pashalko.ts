import { Event, Events, Constants } from 'comx'

export default {
  name: Events.ClientReady,
  callback: async (c, client) => {
    console.log(client.channels)
  }
} as Event
