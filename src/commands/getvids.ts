import { Command, Utils, Heleprs } from 'comx'
import { MessageFlags, TextChannel } from 'discord.js'

export default {
    name: 'getvids',
    description: 'getvids test',
    dev: true,
    guilds: ['1335656368241119352'],
    callback: async (interaction, instance) => {
        await interaction.deferReply()

        const guild = await instance.client.guilds.fetch('1335656368241119352')
        const channel = await guild.channels.fetch('1340374435294740560') as TextChannel

        const messages = await Utils.fetchMessages(channel, 1000)

        const clientUserId = instance.client.user?.id
        if (!clientUserId) return interaction.editReply({ content: 'Bot user not available.' })

        const videoMessages = messages.filter(m => {
            // exclude messages from the user who ran the command
            if (m.author?.id === interaction.user.id) return false

            // messages with video attachments
            if (m.attachments && m.attachments.size > 0) {
                for (const att of m.attachments.values()) {
                    const ct = att.contentType ?? ''
                    if (ct.startsWith('video') || /\.(mp4|mov|webm|mkv|m4v)(\?|$)/i.test(att.name || '')) return true
                }
            }

            // messages with vk.com or youtube links
            const content = m.content ?? ''
            if (/vk\.com|youtube\.com|youtu\.be/i.test(content)) return true

            return false
        })

        // helper: return link to the message containing the video (avoid CDN links)
        const extractUrl = (_m: any): string | null => {
            if (!guild?.id || !channel?.id || !_m?.id) return null
            return `https://discord.com/channels/${guild.id}/${channel.id}/${_m.id}`
        }

        const unviewed: { msg: any; url: string }[] = []

        for (const m of videoMessages) {
            let reacted = false
            try {
                for (const reaction of m.reactions.cache.values()) {
                    // try fast cache check first
                    if (reaction.users.cache && reaction.users.cache.has(interaction.user.id)) {
                        reacted = true
                        break
                    }

                    // fetch recent users for this reaction
                    const users = await reaction.users.fetch({ limit: 100 })
                    if (users && users.has(interaction.user.id)) {
                        reacted = true
                        break
                    }
                }
            } catch (err) {
                // ignore fetch errors and assume no reaction by user for that reaction
            }

            if (!reacted) {
                const url = extractUrl(m)
                if (url) unviewed.push({ msg: m, url })
            }
        }

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