import { SlashCommandHandler } from './slashCommandHandler/handler'
import { EventHandler } from './eventHandler/handler'
import { EventsDir } from './eventHandler/event'
import { Client } from 'discord.js'

export class Spamtong {
  private static instance: Spamtong
  private client: Client
  private token: string
  private appId: string
  private owner: string
  private isDev = false
  
  public config?: JSON

  private constructor(options: Options) {
    const {
      client,
      token,
      appId,
      owner,
      isDev,
      commandsDir,
      eventsDir,
      cfgPath,
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

    if (cfgPath) {
      this.config = this.readJSONConfig()
    }

    this.client.login(this.token)
  }

  public static getInstance(options: Options): Spamtong {
    if (!this.instance) {
      return new Spamtong(options)
    }

    return this.instance
  }

  private readJSONConfig(): JSON {
    return JSON
  }
}

interface Options {
  client: Client,
  token: string,
  appId: string,
  owner: string,
  isDev: boolean,
  commandsDir?: string[],
  eventsDir?: EventsDir[],
  cfgPath?: string,
}