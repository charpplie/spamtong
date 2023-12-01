import { SlashCommand } from '@/comx'
import { gql, GraphQLClient } from 'graphql-request'


export default {
  name: 'get-items',
  description: 'GET LOST',
  options: [
    {
      name: 'type',
      description: 'Selfdescriptive',
      type: 'STRING',
      required: true,
      choices: [
        { name: 'ids',     value: 'ids' },
        { name: 'names',   value: 'names'},
        { name: 'default', value: 'default'},
      ]
    }
  ],
  guilds: ['1150427580734906368'],
  cooldown: '1m',
  isOwnerOnly: true,
  callback: async (interaction) => {
    await interaction.deferReply({
      ephemeral: true
    })
    const type = interaction.options.get('type')?.value

    const ENDPOINT      = 'https://api.stratz.com/graphql'
    const graphQLClient = new GraphQLClient(ENDPOINT, { headers: { authorization: `Bearer ${process.env.stratz}` }})

    const ITEMS_GQL = gql`
    {
      constants {
        items(language: ENGLISH) {
          displayName
          name
          id
        }
      }
    }
    `

    const ITEMS_DATA: any = await graphQLClient.request(ITEMS_GQL)

    let items = ''

    for (let i = 0; i < ITEMS_DATA.constants.items.length; i++) {
      switch (type) {
        case 'ids': {
          items = items + `${ITEMS_DATA.constants.items[i].id},\n`
          break
        }
        case 'names': {
          items = items + `[${ITEMS_DATA.constants.items[i].id}]: \'${String(ITEMS_DATA.constants.items[i].name).replace('\'', '\\\'')}\',\n`
          break
        }
        case 'default': {
          items = items + `[${ITEMS_DATA.constants.items[i].id}]: \'${String(ITEMS_DATA.constants.items[i].displayName).replace('\'', '\\\'')}\',\n`
          break
        }
      }
    }

    const maxLength = 250
    const chunks = items.match(new RegExp(`.{1,${maxLength}}`, 'g')) || []
    chunks.forEach(chunk => console.log(chunk))
    await interaction.editReply({ content: 'get lost' })
  }
} as SlashCommand