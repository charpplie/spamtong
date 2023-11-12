import { Event, Events, CustomClient } from '../comx'

export default {
  name: Events.ClientReady,
  callback: async (client: CustomClient) => {
  }
} as Event