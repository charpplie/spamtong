import { Events } from 'discord.js'
import { BotManager } from '../classes/botManager'
import { Context, FilterQuery } from 'grammy'

interface Event {
  name: Events,
  dev?: boolean | false,
  callback: (instance: BotManager, ...args: any[]) => void,
}

interface EventTg {
  name: FilterQuery | FilterQuery[],
  dev?: boolean | false,
  callback: (instance: BotManager, ctx: Context) => void,
}

export {
  Event,
  Events,
  EventTg,
}