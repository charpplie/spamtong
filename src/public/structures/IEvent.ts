import { Client, Events } from 'discord.js'

export interface Event {
  name: Events,
  once?: boolean | false,
  callback: (client: Client, ...args: any[]) => void,
}

export { Events }