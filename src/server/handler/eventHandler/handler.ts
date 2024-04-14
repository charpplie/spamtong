import { Client } from 'discord.js'
import { EventsDir } from './event'
import { readdirSync } from 'fs'
import { join } from 'path'

export class EventHandler {
  private client: Client
  private isDev = false

  public constructor(options: Options) {
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
    const handler = async (dir: string, name_override?: string, dev?: boolean) => {
      const files = readdirSync(dir, { withFileTypes: true })

      for (const file of files) {
        const filePath = join(dir, file.name)

        if (file.name.charAt(0) === '!') continue
        if (!file.isDirectory() && !file.name.endsWith('.ts')) continue
        if (file.isDirectory()) {
          await handler(filePath, name_override, dev)
          continue
        }

        const event = (await import(filePath)).default
        if (this.isDev) {
          if (dev) {
            if (event.dev && event.dev === false) {
              continue
            }
          }
          else if (!event.dev) continue
        }

        if (name_override) {
          if (event && typeof event === 'function') {
            this.client.on(name_override, async (...args: any[]) => {
              event(this.client, ...args)
            })
          }
        } else {
          if (event && typeof event.name === 'string' && typeof event.callback === 'function') {
            this.client.on(event.name, async (...args: any[]) => {
              event.callback(this.client, ...args)
            })
          }
        }
      }
    }

    for (const eventDir of eventsDir) await handler(eventDir.dir, eventDir.name_override, eventDir.dev)
  }
}

interface Options {
  client: Client,
  isDev: boolean,
  eventsDir: EventsDir[],
}