import { Events } from 'discord.js'
import { Jukai } from '../classes/jukai'

interface Event {
  name: Events | string,
  dev?: boolean | false,
  callback: (instance: Jukai, ...args: any[]) => void,
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