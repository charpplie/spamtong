import { Client, ClientOptions } from 'discord.js'
import { Bot } from 'grammy'
import { IBotConfig } from '../../../config'
import { CommandHandler } from './commandHandler'
import { EventHandler, EventHandlerTg } from './eventHandler'

export class BotManager {
  private config: IBotConfig

  public isDev: boolean
  public client: Client
  public tgClient: Bot

  public constructor(config: IBotConfig) {
    this.config = config
    this.isDev = config.isDev

    const {
      Discord,
      Telegram,
    } = config

    this.client = new Client(Discord.client)
    this.tgClient = new Bot(Telegram.token)

    if (Discord.commandsDir) {
      new CommandHandler(this, this.client, config.Discord)
    }

    if (Discord.eventsDir) {
      new EventHandler({
        instance: this,
        client: this.client,
        events: Discord.eventsDir,
      })
    }

    // if (telegramOptions.commandsDir) {
    //   new CommandHandlerTg({
    //     instance: this,
    //     client: this.tgClient,
    //     commandsDir: telegramOptions.commandsDir,
    //   })
    // }

    if (Telegram.eventsDir) {
      new EventHandlerTg({
        instance: this,
        client: this.tgClient,
        events: Telegram.eventsDir,
      })
    }

    this.init(Discord.token)
  }

  private async init(token: string) {
    await this.client.login(token)
    await this.tgClient.start()
  }

  public getOwnerIcon(): string {
    return this.client.users.cache.get(this.config.Discord.owner)?.avatarURL({ forceStatic: true })!
  }
}

interface SharedOptions {
  isDev: boolean,
}

interface DiscordOptions {
  client: ClientOptions,
  token: string,
  appId: string,
  owner: string,
  devs: string[],
  commandsDir?: string[],
  eventsDir?: string[],
}

interface TelegramOptions {
  // client: BotConfig,
  token: string,
  owner: string,
  devs: string[],
  commandsDir?: string[],
  eventsDir?: string[],
}

interface Options {
  sharedOptions: SharedOptions,
  discordOptions: DiscordOptions,
  telegramOptions: TelegramOptions
}

interface DiscordConfig {
  owner: string,
  devs: string[],
}

interface TelegramConfig {
  owner: string,
  devs: string[],
}

interface SharedConfig {
  isDev: boolean,
}