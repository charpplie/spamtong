import { Event, Events } from 'comx'
import { Message } from 'discord.js'
import { Spamtong } from 'index'

interface IGuildChance {
  chance: number,
  numberOE: number,
  prdInc: number,
}

interface IGuildPseudoRandom {
  [guild: string]: IGuildChance,
}

const GUILDS = ['1150427580734906368']
const INIT_CHANCE = 7
const PRD_INC = 1.15

let guilds: IGuildPseudoRandom = {}

export default {
  name: Events.MessageCreate,
  callback: async (message: Message) => {
    try {
      if (message.author.bot) return
      if (!message.guild?.id) return
      if (!GUILDS.includes(message.guild?.id)) return

      GUILDS.forEach(_guild => {
        if (_guild === message.guild?.id) {
          const guild = Spamtong.client.guilds.cache.get(_guild)
          if (!guild) return
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
              if (emojis.includes(message.content)) {
                const chance = Math.floor(Math.random() * 100)
                if (chance <= 23) {
                  guilds[`${_guild}`] = {
                    chance: INIT_CHANCE,
                    prdInc: PRD_INC,
                    numberOE: 1,
                  }

                  const regex: RegExp = /<:[^>]+>/g
                  const matches: string[] = message.content.match(regex) || []
                  const emoji = matches[Math.floor(Math.random() * matches.length)]
                  message.react(emoji).catch(() => {})
                } else {
                  guilds[`${_guild}`] = {
                    chance: INIT_CHANCE,
                    prdInc: PRD_INC,
                    numberOE: 1,
                  }

                  const rand_emoji = emojis[Math.floor(Math.random() * emojis.length)]
                  message.react(rand_emoji).catch(() => {})
                }
              } else {
                guilds[`${_guild}`] = {
                  chance: INIT_CHANCE,
                  prdInc: PRD_INC,
                  numberOE: 1,
                }

                const rand_emoji = emojis[Math.floor(Math.random() * emojis.length)]
                message.react(rand_emoji).catch(() => {})
              }
            }
          }
        }
      })
    } catch (why) { Spamtong.error(`${why}`) }
  }
} as Event
