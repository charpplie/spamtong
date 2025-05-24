import { Event, Events } from 'comx'

export default {
    name: Events.ClientReady,
    callback: async (instance) => {
        console.log(`[${(new Date).toLocaleDateString}] Ok!`)
    }
} as Event