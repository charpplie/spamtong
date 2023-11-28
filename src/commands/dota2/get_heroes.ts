import { SlashCommand } from '@/comx'
import { EmbedBuilder } from 'discord.js'
import { gql, GraphQLClient } from 'graphql-request'

export default {
  name: 'get-heroes',
  description: 'GET LOST',
  guilds: ['1150427580734906368'],
  callback: async (interaction) => {
    await interaction.deferReply({
      ephemeral: true,
    })

    const ENDPOINT = 'https://api.stratz.com/graphql'
    const graphQLClient = new GraphQLClient(ENDPOINT, {
      headers: { authorization: `Bearer ${process.env.stratz}` }
    })

    const HEROES = gql`
    {
      constants {
        heroes(language: ENGLISH) {
          displayName
          id
        }
      }
    }
    `
    let heroes: string = ''

    const data: any = await graphQLClient.request(HEROES)

    for (let i = 0; i < data.constants.heroes.length; i++) {
      heroes = heroes + `${data.constants.heroes[i].displayName}: ${data.constants.heroes[i].id}\n`
    }

    const embed = new EmbedBuilder()
      .setColor('DarkPurple')
      .setFooter({ text: `${process.env.footer}`, iconURL: `${process.env.icon}`})
      .setTitle('Dota 2 Heroes')
      .setDescription(`${heroes}`)

    await interaction.editReply({
      embeds: [embed]
    })
  }
} as SlashCommand