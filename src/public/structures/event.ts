import { Events } from 'discord.js'
import { Jukai } from '../classes/jukai'

interface Event {
  name: Events | string,
  dev?: boolean | false,
  callback: (instance: Jukai, ...args: any[]) => void,
  settings?: EventSettingsBase & EventSettingsCustom
}

interface EventSettingsBase {
  uuid: string,
  name: string,
  category: string,
}

interface EventSettingsCustom {
  [key: string]: {
    canBeModified: boolean,
    permissions: any,
    [key: string]: any
  }
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
  EventSettingsBase,
}