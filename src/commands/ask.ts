import 'dotenv/config'
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder} from 'discord.js'
import { SlashCommand } from '../comx'
import { Configuration, OpenAIApi } from 'openai'

const openai = new OpenAIApi(new Configuration({ apiKey: String(process.env.apiKey) }))

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('openai')
    .setDescription('Requests one of OpenAI\'s generative pre-trained transformers (GPT)')
    .addStringOption(option => option
      .setName('request')
      .setDescription('Your request to the OpenAI API (gpt-3.5-turbo)')
      .setRequired(true)),
  callback: async interaction => {
    await interaction.deferReply()

    const request = String(interaction.options.get('request')?.value)

    const chatResult = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: request }]
    })
    
    if (!chatResult) return
    const chatContent = chatResult.data.choices[0].message?.content
    
    if (!chatContent) return
    if (chatContent.length > 2000) await sendLongMessage(interaction, chatContent)
    else await interaction.editReply(chatContent)
  },
}

async function sendLongMessage(interaction: CommandInteraction, content: string) {
  const chunkSize = 2000
  const chunks = content.match(new RegExp(`.{1,${chunkSize}}`, 'gs')) || []

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    await interaction.channel?.send({
      content: chunk,
    })
  }
  interaction.editReply({
    content: ''
  })
}

export default command