import { IEvent, CEvents } from '../comx'

const reactions = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
]

export default {
  name: CEvents.MessageCreate,
  once: false,
  callback: async (interaction) => {
    try {
      if (interaction.channel.id == '1004117985830649976') {
        if (interaction.attachments.size > 0) {
          for (let i = 0; i < interaction.attachments.size; i++) {
            if (interaction.id != null) {
              if (interaction.attachments.at(i)?.contentType?.substring(0, Number((interaction.attachments.at(i)?.contentType)?.indexOf('/'))) == 'video') {
                for (let j = 0; j < reactions.length; j++) {
                  interaction.react(reactions[j])
                }
              }
            } else {
              return
            }
          }
        }
      }
    } catch (why) {
      console.error(why)
    }
  }
} as IEvent
