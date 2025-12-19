import { Event, Events } from 'comx'
import { Guild, GuildMember } from 'discord.js'

let guild: Guild | null = null
let member: GuildMember | null = null

export default {
    name: Events.VoiceStateUpdate,
    // dev: true,
    callback: async (instance, oldState, newState) => {
        guild = guild == null? instance.client.guilds.cache.get('1150427580734906368')! : guild
        member = member == null? guild?.members.cache.get('783443296382746672') as GuildMember : member
        if (oldState.id == '783443296382746672' && (newState.serverMute || newState.serverDeaf)) {
            member.voice.setDeaf(false)
            member.voice.setMute(false)
        }
    }
} as Event