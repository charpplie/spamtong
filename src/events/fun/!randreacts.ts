import { Constants, Event, Events, Utils } from 'comx'

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
const INIT_CHANCE = 4
const CHANCE_INC = 0.75

const EmojiRegExp: RegExp = /<:[^>]+>/g

function resetGuildChances(guild: string) {
  CGuilds[`${guild}`] = {
    chance: INIT_CHANCE,
    increment: CHANCE_INC,
    numberOfTriggers: 1,
  }
}

export default {
  name: Events.MessageCreate,
  callback: async (instance, message) => {
    if (Constants.vcont_channels.includes(message.channel.id)) return
    try {
      if (message.author.bot) return
      if (!message.guild?.id) return
      if (!GUILDS.includes(message.guild.id)) return

      GUILDS.forEach(async (guild) => {
        if (guild !== message.guild?.id) return

        const _guild = instance.client.guilds.cache.get(guild)
        if (!_guild) return

        const emojis = _guild.emojis.cache.map((e: any) => { return `<:${e.name}:${e.id}>` })

        if (!CGuilds[`${guild}`]) resetGuildChances(guild)
        else {
          if (Utils.Random(100) <= CGuilds[`${guild}`].chance) {
            resetGuildChances(guild)

            const messages = await Utils.fetchMessages(message.channel, 4)
            if (messages.every(msg => msg.author.id === message.author.id)) {
              let text = ''
              messages.forEach(msg => { text += msg.content + ' ' })
              if (text.match(EmojiRegExp)) {
                if (Utils.Random(100) <= 23) {
                  const matches: string[] = text.match(EmojiRegExp) || []
                  const emoji = matches[Utils.Random(matches.length)]
                  message.react(emoji).catch(() => { })
                  return
                }
              }
            }

            const rand_emoji = emojis[Utils.Random(emojis.length)]
            message.react(rand_emoji).catch(() => { })
            return
          }

          CGuilds[`${guild}`] = { chance: INIT_CHANCE + (CGuilds[`${guild}`].increment * CGuilds[`${guild}`].numberOfTriggers), increment: CHANCE_INC, numberOfTriggers: CGuilds[`${guild}`].numberOfTriggers += 1 }
        }
      })
    } catch (why) { }
  }
} as Event