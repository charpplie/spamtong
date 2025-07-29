import { ClientOptions } from 'discord.js'

export interface IDiscordConfig {
    client: ClientOptions,
    token: string,
    appId: string,
    owner: string,
    commandsDir: string,
    eventsDir: string,
    devs: string | string[],
}

export interface ITelegramConfig {
    token: string,
    commandsDir: string,
    eventsDir: string,
    devs: string | string[],
}

export interface IBotConfig {
    isDev: boolean | false,
    Discord: IDiscordConfig,
    Telegram: ITelegramConfig,
}

export interface IConfig {
    EvO: {
        Radio: {
            Discord: {
                Guild: string,
                Channel: string,
            },
            Telegram: {
                Channel: string
            },
        },
    },
    CmO: {},
}