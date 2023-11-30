import { SlashCommand } from '@/comx'
import { gql, GraphQLClient } from 'graphql-request'


export default {
  name: 'get-items',
  description: 'GET LOST',
  options: [
    {
      name: 'ids-only',
      description: 'Selfdescriptive',
      type: 'BOOLEAN',
      required: false
    }
  ],
  guilds: ['1150427580734906368'],
  cooldown: '1m',
  isOwnerOnly: true,
  callback: async (interaction) => {
    await interaction.deferReply({
      ephemeral: true
    })

    const idsOnly = interaction.options.get('ids-only')?.value

    const ENDPOINT      = 'https://api.stratz.com/graphql'
    const graphQLClient = new GraphQLClient(ENDPOINT, { headers: { authorization: `Bearer ${process.env.stratz}` }})

    const ITEMS_GQL = gql`
    {
      constants {
        items(language: ENGLISH) {
          displayName
          id
        }
      }
    }
    `

    const ITEMS_DATA: any = await graphQLClient.request(ITEMS_GQL)

    let items = ''

    for (let i = 0; i < ITEMS_DATA.constants.items.length; i++) {
      if (idsOnly) {
        items = items + `${ITEMS_DATA.constants.items[i].id},\n`
      } else {
        items = items + `[${ITEMS_DATA.constants.items[i].id}]: \'${String(ITEMS_DATA.constants.items[i].displayName).replace('\'', '\\\'')}\',\n`
      }
    }

    const maxLength = 250
    const chunks = items.match(new RegExp(`.{1,${maxLength}}`, 'g')) || []
    chunks.forEach(chunk => console.log(chunk))
    await interaction.editReply({
      content: 'get lost'
    })
  }
} as SlashCommand