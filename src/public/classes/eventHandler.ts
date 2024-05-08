import { Event, EventsDir } from '../structures/event'
import { Client } from 'discord.js'
import { Utils } from '../comx'
import { Jukai } from './jukai'

export class EventHandler {
  private instance: Jukai
  private client: Client
  private isDev: boolean

  public constructor(options: Options) {
    const {
      instance,
      client,
      events,
      isDev,
    } = options

    this.instance = instance
    this.client = client
    this.isDev = isDev

    this.registerEvents(events)
  }

  private async registerEvents(eventsDir: EventsDir[]) {
    for (const eventDir of eventsDir) {
      const events = await Utils.readObjects<Event | Function>(eventDir.dir)

      for (const event of events) {
        if (this.isDev) {
          if (eventDir.dev) {
            if (typeof event === 'object' && event.dev === false) {
              continue
            }
          } else if (typeof event === 'object' && !event.dev) {
            continue
          }
        }

        if (eventDir.name_override) {
          if (typeof event === 'function') {
            this.client.on(eventDir.name_override, async (...args: any[]) => {
              event(this.instance, ...args)
            })
          }
        } else {
          if (typeof event === 'object' && typeof event.name === 'string' && typeof event.callback === 'function') {
            this.client.on(event.name, async (...args: any[]) => {
              event.callback(this.instance, ...args)
            })
          }
        }
      }
    }
  }
}

interface Options {
  instance: Jukai,
  client: Client,
  events: EventsDir[],
  isDev: boolean,
}