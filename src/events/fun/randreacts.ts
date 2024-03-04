import { Event, Events } from 'comx'
import { Message, TextChannel } from 'discord.js'
import { fetchMessages } from 'utils'

interface IGuildChance {
  chance: number,
  increment: number,
  numberOfTriggers: number,
}

interface IGuildsPseudoRandom {
  [guild: string]: IGuildChance,
}

let CGuilds: IGuildsPseudoRandom = {}

const GUILDS = ['1150427580734906368']
const INIT_CHANCE = 7
const CHANCE_INC = 1.15

const EmojiRegExp: RegExp = /<:[^>]+>/g

const Random = ((limit = 100) => { return Math.floor(Math.random() * limit) })

function resetGuildChances(guild: string) {
  CGuilds[`${guild}`] = {
    chance: INIT_CHANCE,
    increment: CHANCE_INC,
    numberOfTriggers: 1,
  }
}

export default {
  name: Events.MessageCreate,
  callback: async (client, message: Message) => {
    try {
      if (message.author.bot) return
      if (!message.guild?.id) return
      if (!GUILDS.includes(message.guild.id)) return

      GUILDS.forEach(async (guild) => {
        if (guild !== message.guild?.id) return

        const _guild = client.guilds.cache.get(guild)
        if (!_guild) return

        const emojis = _guild.emojis.cache.map((e: any) => { return `<:${e.name}:${e.id}>` })

        if (!CGuilds[`${guild}`]) resetGuildChances(guild)
        else {
          if (Random() <= CGuilds[`${guild}`].chance) {
            resetGuildChances(guild)

            const messages = await fetchMessages(message.channel as TextChannel, 3)
            if (messages.every(msg => msg.author.id === message.author.id)) {
              let text = ''
              messages.forEach(msg => { text += msg.content + ' '})
              if (text.match(EmojiRegExp)) {
                if (Random() <= 23) {
                  const matches: string[] = text.match(EmojiRegExp) || []
                  const emoji = matches[Random(matches.length)]
                  message.react(emoji).catch(() => {})
                  return
                }
              }
            }

            if (message.content.match(EmojiRegExp)) {
              if (Random() <= 17) {
                const matches: string[] = message.content.match(EmojiRegExp) || []
                const emoji = matches[Random(matches.length)]
                message.react(emoji).catch(() => {})
                return
              }
            }

            const rand_emoji = emojis[Random(emojis.length)]
            message.react(rand_emoji).catch(() => {})
            return
          }

          CGuilds[`${guild}`] = { chance: INIT_CHANCE + (CGuilds[`${guild}`].increment * CGuilds[`${guild}`].numberOfTriggers), increment: CHANCE_INC, numberOfTriggers: CGuilds[`${guild}`].numberOfTriggers += 1 }
        }
      })
    } catch (why) {}
  }
} as Event