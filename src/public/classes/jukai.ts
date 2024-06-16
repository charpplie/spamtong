import { Client, ClientOptions } from 'discord.js'
import { CommandHandler } from './commandHandler'
import { EventHandler } from './eventHandler'
import { EventsDir } from '../structures/event'

export class Jukai {
  private commandHandler?: CommandHandler
  private eventHandler?: EventHandler
  public client: Client
  private owner: string

  public constructor(options: Options) {
    const {
      client,
      token,
      appId,
      owner,
      isDev,
      commandsDir,
      eventsDir,
    } = options

    this.client = new Client(client)
    this.owner = owner

    if (commandsDir) {
      this.commandHandler = new CommandHandler({
        client: this.client,
        token: token,
        appId: appId,
        owner: owner,
        commandsDir: commandsDir,
      })
    }

    if (eventsDir) {
      this.eventHandler = new EventHandler({
        instance: this,
        client: this.client,
        events: eventsDir,
        isDev: isDev,
      })
    }

    this.client.login(token)
  }

  public getOwnerIcon(): string {
    return this.client.users.cache.get(this.owner)?.avatarURL({ forceStatic: true })!
  }
}

interface Options {
  client: ClientOptions,
  token: string,
  appId: string,
  owner: string,
  isDev: boolean,
  commandsDir?: string[],
  eventsDir?: EventsDir[],
}