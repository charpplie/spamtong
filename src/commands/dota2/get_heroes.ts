// import { SlashCommand } from '@/comx'
// import { EmbedBuilder } from 'discord.js'
// import { gql, GraphQLClient } from 'graphql-request'

// export default {
//   name: 'get-heroes',
//   description: 'GET LOST',
//   options: [
//     {
//       name: 'type',
//       description: 'Selfdescriptive',
//       type: 'STRING',
//       required: true,
//       choices: [
//         { name: 'ids', value: 'ids'},
//         { name: 'npcs', value: 'npcs'},
//         { name: 'default', value: 'default'}
//       ]
//     },
//   ],
//   guilds: ['1150427580734906368'],
//   cooldown: '1m',
//   callback: async (interaction) => {
//     await interaction.deferReply({
//       ephemeral: true,
//     })

//     const type = interaction.options.get('type')?.value

//     const ENDPOINT = 'https://api.stratz.com/graphql'
//     const graphQLClient = new GraphQLClient(ENDPOINT, { headers: { authorization: `Bearer ${process.env.stratz}` }})

//     const HEROES = gql`
//     {
//       constants {
//         heroes(language: ENGLISH) {
//           displayName
//           id
//           name
//         }
//       }
//     }
//     `

//     const data: any = await graphQLClient.request(HEROES)

//     let heroes = ''

//     for (let i = 0; i < data.constants.heroes.length; i++) {
//       switch (type) {
//         case 'ids': {
//           heroes = heroes + `${data.constants.heroes[i].id},\n`
//           break
//         }
//         case 'npcs': {
//           heroes = heroes + `[${data.constants.heroes[i].id}]: \'${String(data.constants.heroes[i].name).replace(/npc_dota_hero_/gi, '').replace('\'', '\\\'')}\',\n`
//           break
//         }
//         case 'default': {
//           heroes = heroes + `[${data.constants.heroes[i].id}]: \'${String(data.constants.heroes[i].displayName).replace('\'', '\\\'')}\',\n`
//           break
//         }
//       }
//     }

//     const embed = new EmbedBuilder()
//       .setColor('DarkPurple')
//       .setFooter({ text: `${process.env.footer}`, iconURL: `${process.env.icon}`})
//       .setTitle('Dota 2 Heroes')
//       .setDescription(`${heroes}`)
//     await interaction.editReply({
//       embeds: [embed]
//     })
//   }
// } as SlashCommand