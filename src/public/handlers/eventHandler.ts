import { readdir, lstat } from 'fs/promises'
import { Client } from 'discord.js'
import { Event } from 'comx'
import { join } from 'path'

export async function EventHandler(client: Client, eventsDir: string) {
  async function readEvents(dir: string) {
    const files = await readdir(dir)

    await Promise.all(
      files.map(async (file) => {
        const filePath = join(dir, file)
        const fileStat = await lstat(filePath)
        if (!fileStat.isDirectory() && !filePath.endsWith('.ts')) return
        if (file.charAt(0) === '!') return
        if (fileStat.isDirectory()) {
          await readEvents(filePath)
          return
        }

        const event: Event = (await import(filePath)).default
        if (event.once) client.once(event.name as string, async (...args: any[]) => { event.callback(client, ...args) })
        else client.on(event.name as string, async (...args: any[]) => { event.callback(client, ...args) })
      })
    )
  }

  await readEvents(eventsDir)
}