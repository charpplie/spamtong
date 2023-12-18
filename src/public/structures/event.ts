import { Events } from 'discord.js'

export interface Event {
  name: Events,
  once?: boolean | false,
  callback: (...args: any[]) => void,
}

export { Events }