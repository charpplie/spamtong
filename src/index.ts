import 'dotenv/config'
import { Collection, GatewayIntentBits, Partials } from 'discord.js'
import { SlashCommandHandler, EventHandler } from 'cmdx'
import { CustomClient, SlashCommand } from 'comx'
import { join } from 'path'

class DLogger {
  private static instance: DLogger | null = null
  public client: CustomClient
  public ownerId: string
  public appId: string

  private constructor(token: string, ownerId: string, appId: string) {
    this.client = new CustomClient({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
      ]
    })

    this.ownerId = ownerId
    this.appId = appId

    this.client.commands = new Collection<string, SlashCommand>()
    this.client.cooldowns = new Collection<string, number>()

    EventHandler(this.client, join(__dirname, `${process.env.events}`))
    SlashCommandHandler(this.client, join(__dirname, `${process.env.commands}`))

    this.client.login(token)
  }

  private log(message: string, level: string) {
    const user = this.client.users.cache.get(this.ownerId)
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

  public static getInstance(token: string, ownerId: string, appId: string,): DLogger {
    if (!DLogger.instance) DLogger.instance = new DLogger(token, ownerId, appId)
    return DLogger.instance
  }
}

export const Logger = DLogger.getInstance(`${process.env.token}`, `${process.env.owner}`, `${process.env.appId}`)