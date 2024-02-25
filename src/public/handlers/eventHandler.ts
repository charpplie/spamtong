import { CustomClient, Event } from 'comx'
import { readdir, lstat } from 'fs/promises'
import { Spamtong } from 'index'
import { join } from 'path'

export default async function EventHandler(client: CustomClient, eventsDir: string) {
  async function readEvents(dir: string) {
    const files: string[] = await readdir(dir)

    await Promise.all(
      files.map(async (file) => {
        const filePath = join(dir, file)
        const fileStat = await lstat(filePath)

        if (fileStat.isDirectory()) {
          await readEvents(filePath)
          return
        }

        try {
          const event: Event = (await import(filePath)).default
          client.on(event.name as string, async (...args: any[]) => {event.callback(...args)})
        } catch (error) {
          Spamtong.error(`Error executing event ${filePath}: ${error}`)
        }
      })
    )
  }

  await readEvents(eventsDir)
}