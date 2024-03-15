import { Client, Collection } from 'discord.js'
import { EventsDir } from './event'
import { readdirSync } from 'fs'
import { join } from 'path'

export class EventHandler {
  private client: Client
  private events: Collection<string, [string, Function]> = new Collection<string, [string, Function]>()

  public constructor(client: Client, eventsDir: EventsDir[]) {
    this.client = client

    this.readEvents(eventsDir).then(() => this.registerEvents())
  }

  private async readEvents(eventsDir: EventsDir[]) {
    const __readEvents = async (dir: string, name_override?: string) => {
      const files = readdirSync(dir, {
        withFileTypes: true,
      })

      for (const file of files) {
        const filePath = join(dir, file.name)

        if (file.name.charAt(0) === '!') continue
        if (!file.isDirectory() && !file.name.endsWith('.ts')) continue
        if (file.isDirectory()) { await __readEvents(filePath); continue }

        const eventUID = filePath.split(/[\/\\]/g).pop()! + `${new Date().getTime()}`
        const eventFile = (await import(filePath)).default

        if (name_override) {
          if (eventFile && typeof eventFile === 'function') {
            this.events.set(eventUID, [name_override as string, eventFile])
          }
        } else {
          if (eventFile && typeof eventFile.name === 'string' && typeof eventFile.callback === 'function') {
            this.events.set(eventUID, [eventFile.name as string, eventFile.callback])
          }
        }
      }
    }

    for (const eventDir of eventsDir) await __readEvents(eventDir.dir, eventDir.name_override)
  }

  private registerEvents() {
    for (const eventUID of this.events.keys()) {
      const data = this.events.get(eventUID)

      if (!data) continue

      this.client.on(data[0], async (...args: any[]) => {
        data[1](this.client, ...args)
      })
    }
  }
}