import { SlashCommandHandler } from './slashCommandHandler/handler'
import { EventHandler } from './eventHandler/handler'
import { EventsDir } from './eventHandler/event'
import { Client } from 'discord.js'

class Spamtong {
  private static instance: Spamtong
  private client: Client
  private token: string
  private appId: string
  private owner: string
  private isDev = false

  private static ownerIcon: string

  private constructor(options: SOptions) {
    const {
      client,
      token,
      appId,
      owner,
      isDev,
      commandsDir,
      eventsDir,
    } = options

    this.client = client
    this.token = token
    this.appId = appId
    this.owner = owner
    this.isDev = isDev

    if (eventsDir) {
      new EventHandler({
        client: this.client,
        isDev: this.isDev,
        eventsDir: eventsDir,
      })
    }

    if (commandsDir) {
      new SlashCommandHandler({
        client: this.client,
        token: this.token,
        appId: this.appId,
        owner: this.owner,
        commandsDir: commandsDir,
      })
    }

    this.client.login(this.token)
  }

  public static getInstance(options: SOptions): Spamtong {
    if (!this.instance) {
      return new Spamtong(options)
    }

    return this.instance
  }

  public getOwnerIcon(): string {
    const icon = this.client.users.cache.get(`${this.owner}`)?.avatarURL({ forceStatic: true })

    return icon!
  }
}

interface SOptions {
  client: Client,
  token: string,
  appId: string,
  owner: string,
  isDev: boolean,
  commandsDir?: string[],
  eventsDir?: EventsDir[],
}

export {
  Spamtong,
  SOptions,
}