import { SlashCommand } from '@/comx'
import { gql, GraphQLClient } from 'graphql-request'

export default {
  name: 'hero',
  description: 'IB&SB',
  options: [
    {
      name: 'hero',
      description: 'The hero id. You can it get using the /get-heroes command',
      type: 'INTEGER',
      required: true,
      minValue: 0,
      maxValue: 32767,
    },
    {
      name: 'position',
      description: 'position',
      type: 'STRING',
      required: true,
      choices: [
        { name: 'Carry',        value: 'POSITION_1'},
        { name: 'Mid',          value: 'POSITION_2'},
        { name: 'Offlane',      value: 'POSITION_3'},
        { name: 'Soft Support', value: 'POSITION_4'},
        { name: 'Hard Support', value: 'POSITION_5'},
      ]
    },
    {
      name: 'with-hero',
      description: 'The hero id to include in this query',
      type: 'INTEGER',
      required: false,
      minValue: 0,
      maxValue: 32767,
    },
    {
      name: 'against-hero',
      description: 'The hero id to include in this query',
      type: 'INTEGER',
      required: false,
      minValue: 0,
      maxValue: 32767,
    },
    {
      name: 'is-pro',
      description: 'Determines that the query require the results come with a player that is qualified as a Pro.',
      type: 'BOOLEAN',
      required: false,
    },
  ],
  cooldown: '5m',
  callback: async (interaction) => {
    await interaction.deferReply({
      ephemeral: true
    })

    const ENDPOINT = 'https://api.stratz.com/graphql'
    const graphQLClient = new GraphQLClient(ENDPOINT, {
      headers: { authorization: `Bearer ${process.env.stratz}` }
    })

    const heroId = interaction.options.get('hero')?.value
    const pos = interaction.options.get('position')?.value
    const withHero = interaction.options.get('with-hero')?.value
    const againstHero = interaction.options.get('against-hero')?.value
    const isPro = interaction.options.get('is-pro')?.value

    const HERO = gql`
    {
      constants {
        hero(id: ${heroId}) {
          name
        }
      }
    }
    `

    const HERO_DATA: any = await graphQLClient.request(HERO)

    if (HERO_DATA.constants.hero === null) {
      await interaction.editReply({
        content: 'шо за хуйню ты мне дал'
      })
      return
    }

    let HERO_GUIDE_ARGS = `heroId: ${heroId}, positionId: ${pos}`

    if (withHero) HERO_GUIDE_ARGS += `, withHeroId: ${withHero}`
    if (againstHero) HERO_GUIDE_ARGS += `, againstHeroId: ${againstHero}`
    if (isPro) HERO_GUIDE_ARGS += `, isPro: ${isPro}`

    const HERO_POS_MC = gql`
    {
      heroStats {
        guide(${HERO_GUIDE_ARGS}) {
          matchCount
        }
      }
    }
    `

    const HERO_POS_MC_DATA: any = await graphQLClient.request(HERO_POS_MC)

    if (HERO_POS_MC_DATA.heroStats.guide.length <= 0) {
      await interaction.editReply({
        content: `<:poel:1168156790245040169>`
      })
      return
    }

    const HERO_GUIDE = gql`
    {
      heroStats {
        guide(${HERO_GUIDE_ARGS}) {
          guides(take: 10) {
            steamAccountId
          }
        }
      }
    }
    `

    const HERO_GUIDE_DATA: any = await graphQLClient.request(HERO_GUIDE)

    for (let i = 0; i < HERO_GUIDE_DATA.heroStats.guide[0].length; i++) {
      const steamId = HERO_GUIDE_DATA.heroStats.guide[0].guides[0].steamAccountId
      const HERO_GUIDES = gql`
      {
        heroStats {
          guide(${HERO_GUIDE_ARGS}) {
            guides(take: 10) {
              match {
                players(steamAccountId: ${steamId}) {
                  playbackData {
                    purchaseEvents {
                      time
                      itemId
                    }
                  }
                }
              }
            }
          }
        }
      }`

      const HERO_GUIDES_DATA: any = await graphQLClient.request(HERO_GUIDES)
      let str = ''
      for (let j = 0; j < HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].playbackData.purchaseEvents.length; j++) {
        const ITEM = gql`
        {
          constants {
            item(id: ${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].playbackData.purchaseEvents[j].itemId}) {
              displayName
            }
          }
        }
        `
        const ITEM_DATA: any = await graphQLClient.request(ITEM)
        str += `${(HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].playbackData.purchaseEvents[j].time / 60).toFixed(2)} - ${ITEM_DATA.constants.item.displayName}\n`
      }

      await interaction.editReply({
        content: str
      })
    }
  }
} as SlashCommand