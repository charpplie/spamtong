import { Message, Snowflake, TextChannel } from 'discord.js'
import { readFileSync } from 'fs'
import axios from 'axios'

export function Sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

export const Random = ((limit = 100) => { return Math.floor(Math.random() * limit) })

export function RandomText(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let randomText = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomText += characters.charAt(randomIndex)
  }

  return randomText
}

export async function fetchMessages(channel: TextChannel, limit: number): Promise<Message[]> {
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

export async function uploadToImgur(accessToken: string, filename: string) {
  try {
    const response = await axios.post(
      'https://api.imgur.com/3/image',
      { image: readFileSync(filename, 'base64'), type: 'base64' },
      { headers: { Authorization: `Client-ID ${accessToken}` } },
    )

    return response.data.data.link
  } catch (why) {}
}