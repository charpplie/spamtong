import { Events } from 'discord.js'
import { Jukai } from '../classes/jukai'
import { Settings } from './params'

interface Event {
  name: Events | string,
  dev?: boolean | false,
  callback: (instance: Jukai, ...args: any[]) => void,
  settings?: Settings
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