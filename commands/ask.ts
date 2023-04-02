/*import { Message } from 'discord.js'
import { Configuration, OpenAIApi } from 'openai'
import { ICommand } from '../cmdx'

const openai = new OpenAIApi(new Configuration({ apiKey: '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' }))

const command: ICommand = {
    name: 'ask',
    async callback(message: Message, ...args: string[]) {
      try {
        const chatResult = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: args.join(' ') }]
        })

        const chatContent = chatResult.data.choices[0].message?.content
  
        if (!chatContent) {
          message.reply('<:poel:955585430596771890>')
          return
        }

        if (chatContent.length > 2000) {
          await sendLongMessage(message, chatContent)
        } else {
          await message.reply(chatContent)
        }
      } catch (why) {
        message.reply('<:poel:955585430596771890>')
      }
    }
}

async function sendLongMessage(message: Message, content: string) {
    const chunkSize = 2000
    const chunks = content.match(new RegExp(`.{1,${chunkSize}}`, 'gs')) || []

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      await message.channel.send(chunk)
    }
}

export default command*/