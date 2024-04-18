import { Client, Events } from 'discord.js'
import { Spamtong } from '../spamtong'

interface Event {
  name: Events | string,
  dev?: boolean | false,
  callback: (options: EventOptions, ...args: any[]) => void,
}

interface EventOptions {
  client: Client,
  instance: Spamtong,
}

interface EventsDir {
  dir: string,
  dev?: boolean | false,
  name_override?: Events | string,
}

export {
  Event,
  Events,
  EventsDir,
}