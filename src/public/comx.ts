import { CUtils } from './classes/utils'
import { PrismaClient } from '@prisma/client'

export const g_Prisma = new PrismaClient()

export const Utils = new CUtils()

export { Command } from './structures/command'
export { Event, Events } from './structures/event'