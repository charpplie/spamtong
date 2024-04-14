import { Event, Events, fetchMessages, Random } from 'index'
import { RReactsModel, RRChanged, setRRChanged } from 'models/guilds/randreacts'
import { Client, Guild } from 'discord.js'

interface IGuildData {
  enabled: boolean,
  init: number,
  inc: number,
  emoji_list: string[],
  include?: string[],
  exclude?: string[],
}

interface IGuildChance {
  chance: number,
  numberOfTriggers: number,
}

interface IGuildsData {
  [guild: string]: IGuildData
}

interface IGuildsPseudoRandom {
  [guild: string]: IGuildChance,
}

const GuildsData: IGuildsData = {}
const Guilds: IGuildsPseudoRandom = {}

const EmojiRegExp: RegExp = /<:[^>]+>/g

function resetGuildChances(guildId: string) {
  Guilds[guildId] = {
    chance: GuildsData[guildId].init,
    numberOfTriggers: 1
  }
}

async function loadGuildsValues(client: Client) {
  const guilds: Guild[] = client.guilds.cache.map((guild: Guild) => { return guild })

  for (const _guild of guilds) {
    const guild = await RReactsModel.findOne({ where: { guildId: _guild.id }})

    const enabled = guild?.get('enabled') as boolean
    const init = guild?.get('init') as number
    const inc = guild?.get('inc') as number
    const emoji_list = guild?.get('emoji_list') as string
    const include = guild?.get('include') as string
    const exclude = guild?.get('exclude') as string

    GuildsData[_guild.id] = {
      enabled: enabled,
      init: init,
      inc: inc,
      emoji_list: emoji_list.split(';'),
      include: include? include.split(';') : undefined,
      exclude: exclude? exclude.split(';') : undefined,
    }
  }
}

let FIRST_LAUNCH = true

export default {
  name: Events.MessageCreate,
  dev: true,
  callback: async (client, message) => {
    while (true) {}
    if (RRChanged || FIRST_LAUNCH) {
      setRRChanged(false)
      await loadGuildsValues(client)
      FIRST_LAUNCH = false
    }

    if (message.author.bot || !message.guild || !GuildsData[message.guild.id].enabled) return

    const guildId = message.guild.id

    if (GuildsData[guildId].include || GuildsData[guildId].exclude) {
      if (GuildsData[guildId].include) {
        if (!GuildsData[guildId].include?.includes(message.channel.id)) return
      } else if (GuildsData[guildId].exclude) {
        if (GuildsData[guildId].exclude?.includes(message.channel.id)) return
      }
    }

    const emoji_list = GuildsData[guildId].emoji_list

    if (!Guilds[guildId]) {
      resetGuildChances(guildId)
    } else {
      if (Random() <= Guilds[guildId].chance) {
        resetGuildChances(guildId)

        const messages = await fetchMessages(message.channel, 3)
        if (messages.every(msg => msg.author.id === message.author.id)) {
          let text = ''
          messages.forEach(msg => { text += msg.content + ' ' })
          if (text.match(EmojiRegExp)) {
            if (Random() <= 13) {
              const matches: string[] = text.match(EmojiRegExp) || []
              const emoji = matches[Random(matches.length)]

              try {
                message.react(emoji)
              } catch (why) {
                console.error(why)
              }

              return
            }
          }
        }

        if (message.content.match(EmojiRegExp)) {
          if (Random() <= 13) {
            const matches: string[] = message.content.match(EmojiRegExp) || []
            const emoji = matches[Random(matches.length)]

            try {
              message.react(emoji)
            } catch (why) {
              console.error(why)
            }

            return
          }
        }

        const rand_emoji = emoji_list[Random(emoji_list.length)]

        try {
          message.react(rand_emoji)
        } catch (why) {
          console.error(why)
        }

        return
      }

      Guilds[guildId] = {
        chance: GuildsData[guildId].init + (GuildsData[guildId].inc * Guilds[guildId].numberOfTriggers),
        numberOfTriggers: Guilds[guildId].numberOfTriggers += 1,
      }
    }
  }
} as Event