import { Event, EventsDir, Utils } from 'comx'
import { Client } from 'discord.js'

export class EventHandler {
  private client: Client
  private isDev: boolean

  public constructor(options: Options) {
    const {
      client,
      events,
      isDev,
    } = options

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
              event(this.client, ...args)
            })
          }
        } else {
          if (typeof event === 'object' && typeof event.name === 'string' && typeof event.callback === 'function') {
            this.client.on(event.name, async (...args: any[]) => {
              event.callback(this.client, ...args)
            })
          }
        }
      }
    }
  }
}

interface Options {
  client: Client,
  events: EventsDir[],
  isDev: boolean,
}