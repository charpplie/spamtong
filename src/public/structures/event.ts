import { Events } from 'discord.js'

export interface Event {
  name: Events,
  callback: (...args: any[]) => void,
}

export { Events }