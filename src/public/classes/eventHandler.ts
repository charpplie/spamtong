import { Client } from 'discord.js'
import { Event, EventTg } from '../structures/event'
import { Utils } from '../comx'
import { BotManager } from './botManager'
import { Bot, Context, Filter, FilterQuery, Middleware } from 'grammy'

export class EventHandler {
  private instance: BotManager
  private client: Client

  public constructor(options: Options) {
    const {
      instance,
      client,
      events,
    } = options

    this.instance = instance
    this.client = client

    this.registerEvents(events)
  }

  private async registerEvents(eventsDir: string[]) {
    for (const eventDir of eventsDir) {
      const events = await Utils.readObjects<Event>(eventDir)

      for (const event of events) {
        if ((event.dev && !this.instance.config.isDev) || (!event.dev && this.instance.config.isDev)) continue

        if (typeof event === 'object') {
          this.client.on(event.name as string, async (...args: any[]) => {
            event.callback(this.instance, ...args)
          })
        }
      }
    }
  }
}

interface Options {
  instance: BotManager,
  client: Client,
  events: string[],
}

export class EventHandlerTg {
  private instance: BotManager
  private client: Bot

  public constructor(options: OptionsTg) {
    const {
      instance,
      client,
      events,
    } = options

    this.instance = instance
    this.client = client

    this.registerEvents(events)
  }

  private async registerEvents(eventsDir: string[]) {
    for (const eventDir of eventsDir) {
      const events = await Utils.readObjects<EventTg>(eventDir)

      for (const event of events) {
        if ((event.dev && !this.instance.config.isDev) || (!event.dev && this.instance.config.isDev)) continue

        if (typeof event === 'object') {
          this.client.on(event.name, async (ctx) => {
            event.callback(this.instance, ctx)
          })
        }
      }
    }
  }
}

interface OptionsTg {
  instance: BotManager,
  client: Bot,
  events: string[]
}