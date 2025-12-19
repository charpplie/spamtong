import { Event, Events } from 'comx'

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance) => {
        const guild = instance.client.guilds.cache.get('1335656368241119352')!
        const logs = await guild.fetchAuditLogs();

        logs.entries.forEach(log => {
            console.log(log)
        })
    }
} as Event