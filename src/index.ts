import 'dotenv/config'
import { Collection, GatewayIntentBits } from 'discord.js'
import { EventHandler, SlashCommandHandler } from '@/cmdx'
import { CustomClient, SlashCommand } from '@/comx'
import { join } from 'path'

class DLogger {
  private static instance: DLogger | null = null
  private client: CustomClient
  private owner: string

  private constructor(token: string, owner: string) {
    this.client = new CustomClient({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ]
    })

    this.owner = owner

    this.client.commands = new Collection<string, SlashCommand>()
    this.client.cooldowns = new Collection<string, number>()

    EventHandler(this.client, join(__dirname, 'events'))
    SlashCommandHandler(this.client, join(__dirname, 'commands'))

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

  public static getInstance(token: string, owner: string): DLogger {
    if (!DLogger.instance) {
      DLogger.instance = new DLogger(token, owner)
    }
    return DLogger.instance
  }
}

export const g_Logger = DLogger.getInstance(`${process.env.token}`, `${process.env.owner}`)