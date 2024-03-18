import { Client, Events } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'

interface Event {
  name: Events | string,
  callback: (client: Client, ...args: any[]) => void,
}

interface EventsDir {
  dir: string,
  name_override?: Events | string,
}

class EventHandler {
  private client: Client

  public constructor(client: Client, eventsDir: EventsDir[]) {
    this.client = client
    this.registerEvents(eventsDir)
  }

  private async registerEvents(eventsDir: EventsDir[]) {
    const handler = async (dir: string, name_override?: string) => {
      const files = readdirSync(dir, { withFileTypes: true })

      for (const file of files) {
        const filePath = join(dir, file.name)

        if (file.name.charAt(0) === '!') continue
        if (!file.isDirectory() && !file.name.endsWith('.ts')) continue
        if (file.isDirectory()) { await handler(filePath); continue }

        const event = (await import(filePath)).default
        if (name_override) {
          if (event && typeof event === 'function') { this.client.on(name_override, async (...args: any[]) => { event(this.client, ...args) }) }
        } else {
          if (event && typeof event.name === 'string' && typeof event.callback === 'function') { this.client.on(event.name, async (...args: any[]) => { event.callback(this.client, ...args) }) }
        }
      }
    }
    for (const eventDir of eventsDir) await handler(eventDir.dir, eventDir.name_override)
  }
}

export {
  Event,
  Events,
  EventHandler,
}