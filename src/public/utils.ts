import { Message, Snowflake, TextChannel } from 'discord.js'

export function Sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

export function generateRandomText(length: number): string {
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