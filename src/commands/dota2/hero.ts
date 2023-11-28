import { SlashCommand } from '@/comx'
import { request, gql, GraphQLClient } from 'graphql-request'

export default {
  name: 'hero',
  description: 'IB&SB',
  options: [
    {
      name: 'test',
      description: 'test',
      type: 'STRING'
    }
  ],
  guilds: ['1150427580734906368'],
  callback: async (interaction) => {
    const endpoint = 'https://api.stratz.com/graphql'
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${process.env.stratz}`
      }
    })

    console.log(interaction.options.get('test'))
    const hero_guide = gql`
    {
      heroStats {
        guide(heroId: 63, positionId: POSITION_1, take: 5) {
          guides(take: 5) {
            matchPlayer {
              matchId
            }
          }
        }
      }
    }`

    interface HeroGuide {
      matchId: Number
    }

    // const data = await graphQLClient.request<HeroGuide>(hero_guide)
    // console.log(data)
  }
} as SlashCommand