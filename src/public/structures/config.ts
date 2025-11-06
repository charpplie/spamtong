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



interface IRadioConfig {
    Discord: {
        Guild: string,
        Channel: string,
    },
    Telegram: {
        Channel: string
    },
}

interface IYTParserConfig {
    Guild: string,
    Channel: string,
    YtChannels: string[],
}

interface IVContConfig {
    // Guild: string,
    Channel: string,
    Reactions: string[]
}

export interface IConfig {
    EvO: {
        Radio: IRadioConfig,
        // Yt: IYTParserConfig,
        Vcont: IVContConfig,
    },
    CmO: {},
}