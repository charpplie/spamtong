// Copyright (C) Thawnezilla 2023

import 'dotenv/config'
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { ISlashCommand } from '../types'
import { Configuration, OpenAIApi } from 'openai'
import axios, { AxiosError } from 'axios'

const openai = new OpenAIApi(new Configuration({ apiKey: String(process.env.apiKey) }))

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

const command: ISlashCommand = {
  command: new SlashCommandBuilder()
  .setName('imagine')
  .setDescription('Turn your imagination into visuals with DALL-E')
  .addStringOption(opt => opt
    .setName('request')
    .setDescription('Your request to DALL-E')
    .setRequired(true))
  .addStringOption(opt => opt
    .setName('size')
    .setDescription('Size of generated image')
    .setRequired(true)
    .addChoices(
      { name: 'Big',    value: '1024x1024'},
      { name: 'Medium', value: '512x512'},
      { name: 'Small',  value: '256x256'},
    )),
  execute: async interaction => {
    await interaction.deferReply()

    try {
      const request = String(interaction.options.get('request')?.value)

      const image = openai.createImage({
        prompt: request,
        n: 1,
        size: (interaction.options.get('size')?.value) as any,
      })

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setColor(Number(process.env.sideLineColor))
          .setFooter({ text: String(process.env.copyrightText), iconURL: String(interaction.client.users.cache.get('783443296382746672')?.avatarURL({ forceStatic: true } )) })
          .setTitle('Your generated image')
          .setDescription(`Your request: ${request}`)
          .setImage(String((await image).data.data[0].url))
        ]
      })
    } catch (error) {
      console.error(error)
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        if (axiosError.response?.statusText == 'Bad Request') {
          await interaction.editReply({
            content: 'Failed to generate image. Please check your input and try again.\nThis message will be deleted in 5 seconds.'
          })
          await sleep(5000)
          await interaction.deleteReply()
        }
      } else {
        await interaction.editReply({
          content: 'An unexpected error ocurred. Please try again later.\nThis message will be deleted in 5 seconds.'
        })
        await sleep(5000)
        await interaction.deleteReply()
      }
    }
  },
  cooldown: 5
}

export default command
