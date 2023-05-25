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

    await interaction.editReply(chatContent)
  },
}

export default command