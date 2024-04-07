import { Client, Events } from 'discord.js'

interface Event {
  name: Events | string,
  callback: (client: Client, ...args: any[]) => void,
}

interface EventsDir {
  dir: string,
  name_override?: Events | string,
}

export {
  Event,
  Events,
  EventsDir,
}