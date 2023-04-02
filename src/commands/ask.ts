import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ISlashCommand } from '../types'
import { Configuration, OpenAIApi } from 'openai'

const openai = new OpenAIApi(new Configuration({ apiKey: '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' }))

const command: ISlashCommand = {
    command: new SlashCommandBuilder()
      .setName('s_ask')
      .setDescription('chatgpt-3.5-turbo')
      .addStringOption(option =>
        option.setName('request')
          .setDescription('Запрос к ChatGPT-3.5-turbo')
          .setRequired(true)
          ),
    execute: async interaction => {
      await interaction.deferReply()
      try {
        let request = interaction.options.get('request')
        const chatResult = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: String(request?.value) }]
        })

        const chatContent = chatResult.data.choices[0].message?.content
  
        if (!chatContent) {
          await interaction.reply('<:poel:955585430596771890>')
          return
        }

        if (chatContent.length > 2000) {
          await sendLongMessage(interaction, chatContent)
        } else {
          await interaction.editReply(chatContent)
        }
      } catch (why) {
        await interaction.reply('<:poel:955585430596771890>')
      }
    },
    cooldown: 5
}

async function sendLongMessage(interaction: CommandInteraction, content: string) {
  const chunkSize = 2000
  const chunks = content.match(new RegExp(`.{1,${chunkSize}}`, 'gs')) || []

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    await interaction.editReply({
      content: chunk,
    })
  }
}

export default command
