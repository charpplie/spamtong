import { CUtils } from './classes/utils'
import { PrismaClient } from '@prisma/client'

export const Utils = new CUtils()
export const Prisma = new PrismaClient()

export { Config } from '../index'
export { Command, CommandTg } from './structures/command'
export { Event, Events, EventTg } from './structures/event'