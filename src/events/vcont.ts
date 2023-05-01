import { IEvent, CEvents } from '../comx'

export default {
  name: CEvents.MessageCreate,
  once: false,
  callback: async (interaction) => {
    if (interaction.channel.id == '1004117985830649976') {
      if (interaction.attachments.size > 0) {
        interaction.react('1️⃣')
        interaction.react('2️⃣')
        interaction.react('3️⃣')
        interaction.react('4️⃣')
        interaction.react('5️⃣')
      }
    }
  }
} as IEvent
