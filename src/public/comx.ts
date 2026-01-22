import { CUtils } from './classes/utils'
import { CHelpers } from './classes/helpers'
import { PrismaClient } from '@prisma/client'

export const Utils = new CUtils()
export const Heleprs = new CHelpers()
// export const Prisma = new PrismaClient()

export { Config } from '../config'
export { Command, CommandTg } from './structures/command'
export { Event, Events, EventTg } from './structures/event'