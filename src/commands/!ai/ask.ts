import { SlashCommandBuilder, CommandInteraction, EmbedBuilder} from 'discord.js'
import { Command } from 'comx'
import Configuration from 'openai'
import OpenAIApi from 'openai'

const openai = new OpenAIApi(new Configuration({ apiKey: String(process.env.apiKey) }))

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

const command: ISlashCommand = {
  command: new SlashCommandBuilder()
    .setName('openai')
    .setDescription('Requests one of OpenAI\'s generative pre-trained transformers (GPT) and so on')
    .addStringOption(option => option
      .setName('request')
      .setDescription('Your request to the OpenAI API (gpt-3.5-turbo for text and dall-e for image)')
      .setRequired(true))
    .addStringOption(option => option
      .setName('type')
      .setDescription('Select the type of generation: text or image')
      .setRequired(true)
      .addChoices(
        { name: 'text', value: 'text'},
        { name: 'image', value: 'image'},
      ))
    .addBooleanOption(option => option
      .setName('ephemeral')
      .setDescription('Set whether message is ephemeral or not (false by default)')
      .setRequired(false)),
  execute: async interaction => {
    let ephemeral = false
    if (interaction.options.get('ephemeral')?.value == true) ephemeral = true

    await interaction.deferReply({ ephemeral: ephemeral })

    try {
      const request = String(interaction.options.get('request')?.value)

      switch (interaction.options.get('type')?.value) {
        case 'text': {
          const chatResult = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: request }]
          })

          if (!chatResult) return
          const chatContent = chatResult.data.choices[0].message?.content

          if (!chatContent) return
          if (chatContent.length > 2000) await sendLongMessage(interaction, chatContent)
          else await interaction.editReply(chatContent)
          break
        }
        case 'image': {
          try {
            const chatResult = openai.createImage({
              prompt: request,
              n: 1,
              size: '1024x1024',
            })
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor(Number(process.env.sideLineColor))
                  .setFooter({ text: `${process.env.copyrightText}`, iconURL: `${interaction.client.users.cache.get('783443296382746672')?.avatarURL({ forceStatic: true })}` })
                  .setTitle('Your generated image')
                  .setDescription(`Your request: ${request}`)
                  .setImage(`${(await chatResult).data.data[0].url}`)
              ]
            })
          } catch (why) {
            console.error(why)
            await interaction.editReply({
              content: `${process.env.comErrText}\n${process.env.msgTimerDel}`
            })
            await sleep(Number(process.env.msgTimerDels))
            await interaction.deleteReply()
            return
          }
          break
        }
      }
    } catch (why) { console.log(why) }
  },
  cooldown: 5
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