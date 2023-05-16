import { Event, Events } from '../comx'
import * as si from 'systeminformation'

export default {
  name: Events.ClientReady,
  once: true,
  callback: async (interaction) => {
    console.log((await si.cpu()).voltage)
  }
} as Event