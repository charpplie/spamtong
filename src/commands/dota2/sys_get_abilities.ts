// import { SlashCommand } from '@/comx'
// import { gql, GraphQLClient } from 'graphql-request'
// import { writeFileSync } from 'fs'

// export default {
//   name: 'get-abilities',
//   description: 'GET LOST',
//   options: [
//     {
//       name: 'type',
//       description: 'Selfdescriptive',
//       type: 'STRING',
//       required: true,
//       choices: [
//         { name: 'ids',     value: 'ids' },
//         { name: 'default', value: 'default'},
//       ]
//     }
//   ],
//   guilds: ['1150427580734906368'],
//   cooldown: '1m',
//   isOwnerOnly: true,
//   callback: async (interaction) => {
//     await interaction.deferReply({
//       ephemeral: true
//     })
//     const type = interaction.options.get('type')?.value

//     const ENDPOINT      = 'https://api.stratz.com/graphql'
//     const graphQLClient = new GraphQLClient(ENDPOINT, { headers: { authorization: `Bearer ${process.env.stratz}` }})

//     const ABILITIES_GQL = gql`
//     {
//       constants {
//         abilities(language: ENGLISH) {
//           name
//           id
//         }
//       }
//     }
//     `

//     const ABILITIES_DATA: any = await graphQLClient.request(ABILITIES_GQL)

//     let abilities = ''

//     for (let i = 0; i < ABILITIES_DATA.constants.abilities.length; i++) {
//       switch (type) {
//         case 'ids': {
//           abilities = abilities + `${ABILITIES_DATA.constants.abilities[i].id},\n`
//           break
//         }
//         case 'default': {
//           abilities = abilities + `[${ABILITIES_DATA.constants.abilities[i].id}]: \'${String(ABILITIES_DATA.constants.abilities[i].name).replace('\'', '\\\'')}\',\n`
//           break
//         }
//       }
//     }

//     writeFileSync('abilities', abilities)
//     await interaction.editReply({ content: 'get lost' })
//   }
// } as SlashCommand