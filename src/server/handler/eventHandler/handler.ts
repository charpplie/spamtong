import { Event, EventsDir } from './event'
import { readObjects } from 'public/utils'
import { SOptions, Spamtong } from '../spamtong'
import { Client } from 'discord.js'

export class EventHandler {
  private instance: Spamtong
  private client: Client
  private isDev = false

  public constructor(instance: Spamtong, options: Omit<Required<SOptions>, 'token' | 'appId' | 'owner' | 'commandsDir'>) {
    this.instance = instance

    const {
      client,
      isDev,
      eventsDir
    } = options

    this.client = client
    this.isDev = isDev

    this.registerEvents(eventsDir)
  }

  private async registerEvents(eventsDir: EventsDir[]) {
    for (const eventDir of eventsDir) {
      const events = await readObjects<Event | Function>(eventDir.dir)

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
              event({
                client: this.client,
                instance: this.instance,
              }, ...args)
            })
          }
        } else {
          if (
            typeof event === 'object' &&
            typeof event.name === 'string' &&
            typeof event.callback === 'function'
          ) {
            this.client.on(event.name, async (...args: any[]) => {
              event.callback({
                client: this.client,
                instance: this.instance,
              }, ...args)
            })
          }
        }
      }
    }
  }
}