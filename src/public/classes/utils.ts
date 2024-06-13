import { TextChannel, Message, Snowflake } from 'discord.js'
import { Dirent, readFileSync } from 'fs'
import { readdir } from 'fs/promises'
import { join } from 'path'
import axios from 'axios'

export class CUtils {
  constructor() { }

  public async readObjects<T>(dir: string): Promise<T[]> {
    const stack: string[] = [dir]
    const objects: T[] = []

    while (stack.length > 0) {
      const currentDir = stack.pop()
      if (!currentDir) continue

      try {
        const files = await readdir(currentDir, { withFileTypes: true })

        for (const file of files) {
          if (this.shouldSkipFile(file)) continue

          const filePath = join(currentDir, file.name)
          if (file.isDirectory()) {
            stack.push(filePath)
          } else {
            try {
              const object: T = (await import('file://' + filePath)).default
              objects.push(object)
            } catch (error) {
              console.error(`Error importing file ${filePath}: ${error}`)
            }
          }
        }
      } catch (error) {
        console.error(`Error reading directory ${currentDir}: ${error}`)
      }
    }

    return objects
  }

  private shouldSkipFile(file: Dirent): boolean {
    return file.name.startsWith('!') || (!file.isDirectory() && !(file.name.endsWith('.ts') || !file.name.endsWith('.js')))
  }

  public Sleep(ms: number): Promise<unknown> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  public Random(limit: number): number {
    return Math.floor(Math.random() * limit)
  }

  public RandomText(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomText = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomText += characters.charAt(randomIndex)
    }

    return randomText
  }

  public async fetchMessages(channel: TextChannel, limit: number): Promise<Message[]> {
    let out: Message[] = []

    if (limit <= 100) {
      const messages = await channel.messages.fetch({ limit: limit })
      out.push(...messages.values())
    } else {
      let rounds = Math.ceil(limit / 100)
      let lastId: Snowflake | undefined = undefined

      for (let i = 0; i < rounds; i++) {
        const options: { limit: number; before?: Snowflake } = {
          limit: 100
        }

        if (lastId) {
          options.before = lastId
        }

        const messages = await channel.messages.fetch(options)

        if (messages.size === 0) break

        out.push(...messages.values())
        lastId = messages.lastKey()!
      }
    }

    return out
  }

  public async uploadToImgur(accessToken: string, filename: string) {
    try {
      const response = await axios.post(
        'https://api.imgur.com/3/image',
        { image: readFileSync(filename, 'base64'), type: 'base64' },
        { headers: { Authorization: `Client-ID ${accessToken}` } },
      )

      return response.data.data.link
    } catch (why) {
      console.error(why)
    }
  }

  public hashCode(str: string): number {
    let hash = 0

    if (str.length == 0) return hash

    for (let i = 0; i < str.length; i++) {
      let char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }

    return hash
  }
}