import { Event, Events } from '../comx'

const reactions = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
]

export default {
  name: Events.MessageCreate,
  once: false,
  callback: async (interaction) => {
    if (interaction.attachments.size > 0) {
      for (let i = 0; i < interaction.attachments.size; i++) {
        const attachment = interaction.attachments.at(i)
        if (attachment && attachment.contentType?.startsWith('video')) {
          for (let j = 0; j < reactions.length; j++) {
            interaction.react(reactions[j]).catch((error: any) => {})
          }
        }
      }
    }
  }
} as Event
