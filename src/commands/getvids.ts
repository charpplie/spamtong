import { Command, Utils, Heleprs } from 'comx'
import { MessageFlags, TextChannel } from 'discord.js'

// Simple in-memory cache for viewed videos: userId -> Set<messageId>
const viewedCache = new Map<string, { timestamp: number; messageIds: Set<string> }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const getCachedViewed = (userId: string): Set<string> => {
    const cached = viewedCache.get(userId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.messageIds
    }
    return new Set()
}

const setCachedViewed = (userId: string, messageIds: Set<string>) => {
    viewedCache.set(userId, { timestamp: Date.now(), messageIds })
}

// Optimized reaction check: first check cache, then check all reactions in parallel
const hasUserReacted = async (message: any, userId: string): Promise<boolean> => {
    if (message.reactions.cache.size === 0) return false

    // Parallel fetch for all reactions with limit
    const reactionChecks = Array.from(message.reactions.cache.values()).map((reaction: any) => {
        // Fast cache check first
        if (reaction.users.cache?.has(userId)) return Promise.resolve(true)

        // Fetch with smaller limit to speed up
        return reaction.users
            .fetch({ limit: 50 })
            .then((users: { has: (arg0: string) => any }) => users.has(userId))
            .catch(() => false)
    })

    // Return true if ANY reaction has the user
    const results = await Promise.all(reactionChecks)
    return results.some(r => r)
}

export default {
    name: 'getvids',
    description: 'getvids test',
    // dev: true,
    // guilds: ['1335656368241119352'],
    guilds: ['1150427580734906368'],
    callback: async (interaction, instance) => {
        await interaction.deferReply()

        const guild = await instance.client.guilds.fetch('1150427580734906368')
        const channel = await guild.channels.fetch('1181427849303965768') as TextChannel

        // const guild = await instance.client.guilds.fetch('1335656368241119352')
        // const channel = await guild.channels.fetch('1340374435294740560') as TextChannel

        const messages = await Utils.fetchMessages(channel, 50)
        const userId = interaction.user.id

        const clientUserId = instance.client.user?.id
        if (!clientUserId) return interaction.editReply({ content: 'Bot user not available.' })

        // Optimized video detection with regex compiled once
        const VIDEO_REGEX = /\.(mp4|mov|webm|mkv|m4v)(\?|$)/i
        const LINK_REGEX = /vk\.com|youtube\.com|youtu\.be/i

        const videoMessages = messages.filter(m => {
            // exclude messages from the user who ran the command
            if (m.author?.id === userId) return false

            // messages with video attachments
            if (m.attachments && m.attachments.size > 0) {
                for (const att of m.attachments.values()) {
                    const ct = att.contentType ?? ''
                    if (ct.startsWith('video') || VIDEO_REGEX.test(att.name || '')) return true
                }
            }

            // messages with vk.com or youtube links
            const content = m.content ?? ''
            if (LINK_REGEX.test(content)) return true

            return false
        })

        // Check cache first
        let viewedMessageIds = getCachedViewed(userId)
        const newlyViewed = new Set(viewedMessageIds)

        // helper: return link to the message containing the video (avoid CDN links)
        const extractUrl = (_m: any): string | null => {
            if (!guild?.id || !channel?.id || !_m?.id) return null
            return `https://discord.com/channels/${guild.id}/${channel.id}/${_m.id}`
        }

        // Process reactions in parallel batches instead of sequentially
        const unviewed: { msg: any; url: string }[] = []
        const BATCH_SIZE = 10 // Check 10 messages in parallel

        for (let i = 0; i < videoMessages.length; i += BATCH_SIZE) {
            const batch = videoMessages.slice(i, i + BATCH_SIZE)
            
            const batchResults = await Promise.all(
                batch.map(async m => {
                    // Check cache first
                    if (newlyViewed.has(m.id)) {
                        return null
                    }

                    const reacted = await hasUserReacted(m, userId)
                    if (reacted) {
                        newlyViewed.add(m.id)
                        return null
                    }

                    const url = extractUrl(m)
                    return url ? { msg: m, url } : null
                })
            )

            unviewed.push(...batchResults.filter(r => r !== null) as any[])
        }

        // Update cache
        setCachedViewed(userId, newlyViewed)

        if (unviewed.length === 0) {
            return interaction.editReply({ embeds: [Heleprs.createEmbed({ title: 'Непросмотренные видео', description: 'Нет непросмотренных видео.' })] })
        }

        // build comma-separated markdown links without spaces: [1](url),[2](url),...
        const items: string[] = []
        for (let i = 0; i < unviewed.length; i++) {
            const idx = i + 1
            const url = unviewed[i].url
            items.push(`[${idx}](${url})`)
        }

        const embed = Heleprs.createEmbed({ title: 'Непросмотренные видео', description: items.join(',') })

        return interaction.editReply({ embeds: [embed] })

    }
} as Command