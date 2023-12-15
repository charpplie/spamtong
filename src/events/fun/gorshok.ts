import { Event } from '@/comx'

interface IGuildChance {
  chance: number,
  numberOE: number,
  prdInc: number,
}

interface IGuildPseudoRandom {
  [guild: string]: IGuildChance,
}

const GUILDS = ['1150427580734906368']
const INIT_CHANCE = 13
const PRD_INC = 1.85

let guilds: IGuildPseudoRandom = {}

export default {
  name: 'messageCreate',
  callback: async (interaction) => {
    if (!GUILDS.includes(interaction.guild.id)) return

    GUILDS.forEach(_guild => {
      if (_guild === interaction.guild.id) {
        const guild = interaction.client.guilds.cache.get(_guild)
        const emojis = guild.emojis.cache.map((e: any) => { return `<:${e.name}:${e.id}>` })

        if (!guilds[`${_guild}`]) {
          guilds[`${_guild}`] = {
            chance: INIT_CHANCE,
            prdInc: PRD_INC,
            numberOE: 0,
          }
        } else {
          guilds[`${_guild}`] = {
            chance: INIT_CHANCE + (guilds[`${_guild}`].prdInc * guilds[`${_guild}`].numberOE),
            prdInc: PRD_INC,
            numberOE: guilds[`${_guild}`].numberOE += 1,
          }

          const chance = Math.floor(Math.random() * 100)
          if (chance <= guilds[`${_guild}`].chance) {
            if (emojis.includes(interaction.content)) {
              const chance = Math.floor(Math.random() * 100)
              if (chance <= 37) {
                guilds[`${_guild}`] = {
                  chance: INIT_CHANCE,
                  prdInc: PRD_INC,
                  numberOE: 1,
                }

                const regex: RegExp = /<:[^>]+>/g
                const matches: string[] = interaction.content.match(regex) || []
                const emoji = matches[Math.floor(Math.random() * matches.length)]
                interaction.react(emoji)
              } else {
                guilds[`${_guild}`] = {
                  chance: INIT_CHANCE,
                  prdInc: PRD_INC,
                  numberOE: 1,
                }

                const rand_emoji = emojis[Math.floor(Math.random() * emojis.length)]
                interaction.react(rand_emoji)
              }
            } else {
              guilds[`${_guild}`] = {
                chance: INIT_CHANCE,
                prdInc: PRD_INC,
                numberOE: 1,
              }

              const rand_emoji = emojis[Math.floor(Math.random() * emojis.length)]
              interaction.react(rand_emoji)
            }
          }

          console.log(guilds)
        }
      }
    })
  }
} as Event