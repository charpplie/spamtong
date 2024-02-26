import 'dotenv/config'
import { Collection, GatewayIntentBits, Partials } from 'discord.js'
import { SlashCommandHandler, EventHandler } from 'cmdx'
import { CustomClient, SlashCommand } from 'comx'
import { join } from 'path'

class DLogger {
  private static instance: DLogger | null = null
  public client!: CustomClient
  public appId!: string
  public owner!: string

  private constructor(token: string) { this.init(token) }

  private async init(token: string) {
    this.client = new CustomClient({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
      ]
    })

    this.client.commands = new Collection<string, SlashCommand>()
    this.client.cooldowns = new Collection<string, number>()

    EventHandler(this.client, join(__dirname, 'events'))

    this.client.login(token)
    this.client.on('ready', async () => {
      await this.client.application?.fetch()
      if (this.client.application?.id) this.appId = this.client.application.id
      if (this.client.application?.owner?.id) this.owner = this.client.application.owner.id
      // SlashCommandHandler(this.client, join(__dirname, 'commands'))
    })
  }

  private log(message: string, level: string) {
    if (!this.owner) {
      setTimeout(() => this.log(message, level), 5000)
    }
    else {
      const user = this.client.users.cache.get(this.owner)
      if (user) user.send(`[${level}]: ${message}`)
    }
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

  public static getInstance(token: string): DLogger {
    if (!DLogger.instance) DLogger.instance = new DLogger(token)
    return DLogger.instance
  }
}

export const Spamtong = DLogger.getInstance(`${process.env.token}`)