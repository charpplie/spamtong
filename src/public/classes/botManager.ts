import { Client, ClientOptions } from 'discord.js'
import { Bot } from 'grammy'
import { CommandHandler } from './commandHandler'
import { EventHandler, EventHandlerTg } from './eventHandler'

export class BotManager {
  public config!: SharedConfig
  public configDs!: DiscordConfig
  public configTg!: TelegramConfig

  public client: Client
  public tgClient: Bot

  public  constructor(options: Options) {
    const {
      discordOptions,
      telegramOptions
    } = options

    this.config = {
      isDev: options.sharedOptions.isDev
    }

    this.configDs = {
      owner: discordOptions.owner,
      devs: discordOptions.devs,
    }

    this.configTg = {
      owner: telegramOptions.owner,
      devs: telegramOptions.devs,
    }

    this.client = new Client(discordOptions.client)
    this.tgClient = new Bot(telegramOptions.token)

    if (discordOptions.commandsDir) {
      new CommandHandler({
        instance: this,
        client: this.client,
        token: discordOptions.token,
        appId: discordOptions.appId,
        commandsDir: discordOptions.commandsDir,
      })
    }

    if (discordOptions.eventsDir) {
      new EventHandler({
        instance: this,
        client: this.client,
        events: discordOptions.eventsDir,
      })
    }

    // if (telegramOptions.commandsDir) {
    //   new CommandHandlerTg({
    //     instance: this,
    //     client: this.tgClient,
    //     commandsDir: telegramOptions.commandsDir,
    //   })
    // }

    if (telegramOptions.eventsDir) {
      new EventHandlerTg({
        instance: this,
        client: this.tgClient,
        events: telegramOptions.eventsDir,
      })
    }

    this.init(discordOptions.token)
  }
  
  private async init(token: string) {
    await this.login(token)
  }

  private async login(token: string) {
    await this.client.login(token).catch(why => {
      console.error(why)
    })

    await this.tgClient.start()
  }

  public getOwnerIcon(): string {
    return this.client.users.cache.get(this.configDs.owner)?.avatarURL({ forceStatic: true })!
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