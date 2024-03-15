import { Client, Events } from 'discord.js'

interface Event {
  name: Events,
  callback: (client: Client, ...args: any[]) => void,
}

interface EventsDir {
  dir: string,
  name_override?: Events,
}

export {
  Event,
  Events,
  EventsDir,
}