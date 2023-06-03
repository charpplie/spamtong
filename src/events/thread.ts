import { Event, Events } from '../comx'

export default {
  name: Events.ThreadCreate,
  callback: async thread => {
    console.log(thread.name)
  }
} as Event