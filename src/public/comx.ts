import {
  APIApplicationCommandOptionChoice,
  Client,
  Collection,
  CommandInteraction,
  LocalizationMap,
} from 'discord.js'

type OptionType = 'STRING' | 'INTEGER' | 'NUMBER' | 'BOOLEAN' | 'USER' | 'CHANNEL' | 'ROLE' | 'MENTIONABLE' | 'ATTACHMENT' | 'SUBCOMMAND' | 'SUBCOMMAND_GROUP'

export interface SlashCommand {
  name: string,
  description: string,
  name_localizations?: LocalizationMap
  description_localizations?: LocalizationMap,
  options?: {
    name: string,
    description: string,
    type: OptionType,
    required?: boolean,
    choices?: APIApplicationCommandOptionChoice<string | number>[],
    minValue?: number,
    maxValue?: number
  }[]
  guilds?: string[]
  isOwnerOnly?: boolean | false
  allowedUsers?: string[],
  cooldown?: string
  callback: (interaction: CommandInteraction) => void,
}

export class CustomClient extends Client {
  public commands!: Readonly<Collection<string, SlashCommand>>
  public cooldowns!: Readonly<Collection<string, number>>
}

export interface Event {
  name: EventType,
  once?: boolean | false
  callback: (...args: any) => void,
}

type EventType =
  | 'applicationCommandPermissionsUpdate'
  | 'autoModerationActionExecution'
  | 'autoModerationRuleCreate'
  | 'autoModerationRuleDelete'
  | 'autoModerationRuleUpdate'
  | 'cacheSweep'
  | 'channelCreate'
  | 'channelDelete'
  | 'channelPinsUpdate'
  | 'channelUpdate'
  | 'ready'
  | 'debug'
  | 'error'
  | 'guildAuditLogEntryCreate'
  | 'guildBanAdd'
  | 'guildBanRemove'
  | 'guildCreate'
  | 'guildDelete'
  | 'emojiCreate'
  | 'emojiDelete'
  | 'emojiUpdate'
  | 'guildIntegrationsUpdate'
  | 'guildMemberAdd'
  | 'guildMemberAvailable'
  | 'guildMemberRemove'
  | 'guildMembersChunk'
  | 'guildMemberUpdate'
  | 'roleCreate'
  | 'roleDelete'
  | 'roleUpdate'
  | 'guildScheduledEventCreate'
  | 'guildScheduledEventDelete'
  | 'guildScheduledEventUpdate'
  | 'guildScheduledEventUserAdd'
  | 'guildScheduledEventUserRemove'
  | 'stickerCreate'
  | 'stickerDelete'
  | 'stickerUpdate'
  | 'guildUnavailable'
  | 'guildUpdate'
  | 'interactionCreate'
  | 'invalidated'
  | 'inviteCreate'
  | 'inviteDelete'
  | 'messageDeleteBulk'
  | 'messageCreate'
  | 'messageDelete'
  | 'messageReactionAdd'
  | 'messageReactionRemove'
  | 'messageReactionRemoveAll'
  | 'messageReactionRemoveEmoji'
  | 'messageUpdate'
  | 'presenceUpdate'
  | 'raw'
  | 'shardDisconnect'
  | 'shardError'
  | 'shardReady'
  | 'shardReconnecting'
  | 'shardResume'
  | 'stageInstanceCreate'
  | 'stageInstanceDelete'
  | 'stageInstanceUpdate'
  | 'threadCreate'
  | 'threadDelete'
  | 'threadListSync'
  | 'threadMembersUpdate'
  | 'threadMemberUpdate'
  | 'threadUpdate'
  | 'typingStart'
  | 'userUpdate'
  | 'voiceServerUpdate'
  | 'voiceStateUpdate'
  | 'warn'
  | 'webhookUpdate'