import 'dotenv/config'
import { Collection, GatewayIntentBits, Partials } from 'discord.js'
import { SlashCommandHandler, EventHandler } from 'cmdx'
import { CustomClient, SlashCommand } from 'comx'
import { join } from 'path'

class DLogger {
  private static instance: DLogger | null = null
  public client: CustomClient
  public appId: string
  public owner: string

  private constructor(options: Options) {
    const {
      token,
      appId,
      owner,
      commandsDir,
      eventsDir,
    } = options

    this.client = new CustomClient({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
      ]
    })

    this.appId = appId
    this.owner = owner

    this.client.commands = new Collection<string, SlashCommand>()
    this.client.cooldowns = new Collection<string, number>()

    EventHandler(this.client, eventsDir)
    // SlashCommandHandler(this.client, commandsDir)

    this.client.login(token)
  }

  private log(message: string, level: string) {
    const user = this.client.users.cache.get(this.owner)
    if (user) user.send(`[${level}]: ${message}`)
  }

  public info(message: string) {
    this.log(message, 'INFO')
  }

  public warn(message: string) {
    this.log(message, 'WARN')
  }

  public error(message: string) {
    this.log(message, 'ERROR')
  }

  public static getInstance(options: Options): DLogger {
    if (!DLogger.instance) DLogger.instance = new DLogger(options)
    return DLogger.instance
  }
}

interface Options {
  token: string,
  appId: string,
  owner: string,
  commandsDir: string,
  eventsDir: string,
}

export const Spamtong = DLogger.getInstance({
  token: `${process.env.token}`,
  appId: `${process.env.appId}`,
  owner: `${process.env.owner}`,
  commandsDir:  join(__dirname, 'commands'),
  eventsDir:    join(__dirname, 'events'),
})