import { CUtils } from './classes/utils'
import { PrismaClient } from '@prisma/client'
import { I18n } from 'i18n'
import { join } from 'path'

export const Utils  = new CUtils()
export const Prisma = new PrismaClient()

export const i18n = new I18n({
    locales: [
        'en',
        'ru'
    ],
    directory: join(__dirname, '../../locales'),
    defaultLocale: 'en',
    retryInDefaultLocale: true,
    objectNotation: true,
    register: global,
    updateFiles: false,
    logWarnFn: function (msg) {
        console.log(msg)
    },
    logErrorFn: function (msg) {
        console.log(msg)
    },
    missingKeyFn: function (locale, value) {
        return value
    },
})

export { Command } from './structures/command'
export { Event, Events } from './structures/event'