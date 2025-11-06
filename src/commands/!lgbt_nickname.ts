import { Command } from 'comx'
import { MessageFlags } from 'discord.js'

const CUSTOM_ROLE_PREFIX = 'c_'

export default {
    name: 'lgbtnick',
    description: 'lgbt nick',
    guilds: ['1335656368241119352'],
    options: [
        {
            name: 'color',
            description: 'без хэштега',
            type: 'String',
            required: true
        }
    ],
    dm_permission: false,
    dev: true,
    callback: async (interaction, instance) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        const color = interaction.options.get('color')

        const guild = instance.client.guilds.cache.get(interaction.guildId!)
        const member = guild?.members.cache.get(interaction.user.id)
        const roles = guild?.roles.cache.forEach(async role => {
            if (!role.name.startsWith(CUSTOM_ROLE_PREFIX)) return

            console.log(role.colors.primaryColor)
            if (role.colors.primaryColor.toString(16) == color.value) {
                await member?.roles.add(role)
            }
        })

        await interaction.editReply({ content: 'Иди нахуй' })
    }
} as Command