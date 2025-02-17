import { Command } from 'comx'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { VoiceRooms } from '../../models/voice_rooms'

export default {
  name: 'get_controls',
  description: 'get_controls',
  dm_permission: false,
  callback: async (interaction, instance) => {
    await interaction.deferReply({ ephemeral: true })

    const user = await VoiceRooms.findOne({ where: { userId: interaction.user.id } })

    const userRooms = user?.get('rooms')
    const shouldntLetUserDeleteRoom = user == null ? true : false // wth is this name broooooooooooo, change it later pls

    const create_room = new ButtonBuilder()
      .setCustomId('create_room')
      .setLabel('create_room')
      .setStyle(ButtonStyle.Primary)

    const delete_room = new ButtonBuilder()
      .setCustomId('delete_room')
      .setLabel('delete_room')
      .setDisabled(shouldntLetUserDeleteRoom)
      .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder().addComponents(create_room, delete_room)

    const embed = new EmbedBuilder().setDescription('Ваши румы:').setColor('Yellow').setFooter({ text: 'test', iconURL: instance.getOwnerIcon() })

    await interaction.editReply({
      embeds: [embed],
      components: [row as any]
    })
  },
  guilds: ['1335656368241119352'],
  // cooldown: {
  //   amount: 5,
  //   multiplier: 'Seconds',
  //   type: 'Per User Per Guild',
  // }
} as Command