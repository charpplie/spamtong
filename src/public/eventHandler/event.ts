import { Client, Events } from 'discord.js'

interface Event {
  name: Events | string,
  dev?: boolean | false,
  callback: (client: Client, ...args: any[]) => void,
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