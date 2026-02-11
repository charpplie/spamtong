import { Command, Utils, Heleprs } from 'comx'
import { MessageFlags, TextChannel, Message, Collection } from 'discord.js'

// Cache for viewed videos: userId -> Set<messageId>
const viewedCache = new Map<string, { timestamp: number; messageIds: Set<string> }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Cache for channel messages to avoid refetching
const messagesCache = new Map<string, { timestamp: number; messages: Message[] }>()
const MESSAGES_CACHE_DURATION = 2 * 60 * 1000 // 2 minutes

const getCachedViewed = (userId: string): Set<string> => {
    const cached = viewedCache.get(userId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return new Set(cached.messageIds)
    }
    return new Set()
}

const setCachedViewed = (userId: string, messageIds: Set<string>) => {
    viewedCache.set(userId, { timestamp: Date.now(), messageIds: new Set(messageIds) })
}

const getCachedMessages = (channelId: string): Message[] | null => {
    const cached = messagesCache.get(channelId)
    if (cached && Date.now() - cached.timestamp < MESSAGES_CACHE_DURATION) {
        return cached.messages
    }
    return null
}

const setCachedMessages = (channelId: string, messages: Message[]) => {
    messagesCache.set(channelId, { timestamp: Date.now(), messages })
}

// Regex compiled once at module level for maximum performance
const VIDEO_REGEX = /\.(mp4|mov|webm|mkv|m4v)(\?|$)/i
const LINK_REGEX = /vk\.com|youtube\.com|youtu\.be/i

// Fast check if message contains video
const isVideoMessage = (m: Message, excludeUserId: string): boolean => {
    if (m.author?.id === excludeUserId) return false

    // Check attachments
    if (m.attachments.size > 0) {
        for (const att of m.attachments.values()) {
            const ct = att.contentType ?? ''
            if (ct.startsWith('video') || VIDEO_REGEX.test(att.name || '')) return true
        }
    }

    // Check links
    return LINK_REGEX.test(m.content ?? '')
}

// Optimized reaction check with early exit using Promise.race
const hasUserReacted = async (message: Message, userId: string): Promise<boolean> => {
    const reactions = message.reactions.cache
    if (reactions.size === 0) return false

    // First pass: check cache only (instant)
    for (const reaction of reactions.values()) {
        if (reaction.users.cache.has(userId)) return true
    }

    // Second pass: fetch in parallel with early exit
    // Use a shared abort signal pattern
    let found = false
    
    const checks = reactions.map(async reaction => {
        if (found) return false // Skip if already found
        try {
            const users = await reaction.users.fetch({ limit: 30 })
            if (users.has(userId)) {
                found = true
                return true
            }
        } catch { }
        return false
    })

    const results = await Promise.all(checks)
    return results.some(r => r)
}

export default {
    name: 'getvids',
    description: 'getvids test',
    dev: true,
    guilds: ['1335656368241119352'],
    // guilds: ['1150427580734906368'],
    callback: async (interaction, instance) => {
        await interaction.deferReply()

        // const guild = await instance.client.guilds.fetch('1150427580734906368')
        // const channel = await guild.channels.fetch('1181427849303965768') as TextChannel

        const guild = await instance.client.guilds.fetch('1335656368241119352')
        const channel = await guild.channels.fetch('1340374435294740560') as TextChannel

        const userId = interaction.user.id
        const clientUserId = instance.client.user?.id
        if (!clientUserId) return interaction.editReply({ content: 'Bot user not available.' })

        // Use cached messages if available
        let messages = getCachedMessages(channel.id)
        if (!messages) {
            messages = await Utils.fetchMessages(channel, Infinity)
            setCachedMessages(channel.id, messages)
        }

        // Filter video messages (fast, no API calls)
        const videoMessages = messages.filter(m => isVideoMessage(m, userId))

        // Get cached viewed messages
        const viewedMessageIds = getCachedViewed(userId)

        // Quick filter: remove already cached as viewed
        const uncheckedVideos = videoMessages.filter(m => !viewedMessageIds.has(m.id))

        // Split: check only last 100, count the rest
        const CHECK_LIMIT = 100
        const videosToCheck = uncheckedVideos.slice(0, CHECK_LIMIT)
        const remainingCount = uncheckedVideos.length - CHECK_LIMIT

        // URL builder
        const buildUrl = (msgId: string) => 
            `https://discord.com/channels/${guild.id}/${channel.id}/${msgId}`

        // Process in larger parallel batches
        const unviewed: string[] = []
        const BATCH_SIZE = 20

        for (let i = 0; i < videosToCheck.length; i += BATCH_SIZE) {
            const batch = videosToCheck.slice(i, i + BATCH_SIZE)
            
            const results = await Promise.all(
                batch.map(async m => {
                    const reacted = await hasUserReacted(m, userId)
                    if (reacted) {
                        viewedMessageIds.add(m.id)
                        return null
                    }
                    return m.id
                })
            )

            for (const id of results) {
                if (id) unviewed.push(buildUrl(id))
            }
        }

        // Update cache
        setCachedViewed(userId, viewedMessageIds)

        if (unviewed.length === 0 && remainingCount <= 0) {
            return interaction.editReply({ embeds: [Heleprs.createEmbed({ title: 'Непросмотренные видео', description: 'Нет непросмотренных видео.' })] })
        }

        // Build links: [1](url),[2](url),...
        const items = unviewed.map((url, i) => `[${i + 1}](${url})`)
        
        let description = items.join(',')
        if (remainingCount > 0) {
            description += `\n\n📦 *...и ещё ${remainingCount} видео в канале*`
        }
        
        const embed = Heleprs.createEmbed({ title: 'Непросмотренные видео', description })

        return interaction.editReply({ embeds: [embed] })

    }
} as Command