import { Events } from 'discord.js'
import { BotManager } from '../classes/botManager'

interface Event {
  name: Events | string,
  dev?: boolean | false,
  callback: (instance: BotManager, ...args: any[]) => void,
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