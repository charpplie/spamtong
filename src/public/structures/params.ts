import { Command } from './command'
import { Event } from './event'

interface SettingsBase {
  uuid: string,
  name: string,
  category: string,
  hidden?: boolean | false,
  include?: string[]
}

interface SettingsCustom {
  [key: string]: {
    canBeModified: boolean,
    permissions: any,
    [key: string]: any,
  }
}

export type Settings = SettingsBase & SettingsCustom