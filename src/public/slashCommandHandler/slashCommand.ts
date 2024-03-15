import {
  APIApplicationCommandOptionChoice,
  AutocompleteInteraction,
  ChannelType,
  CommandInteraction,
  LocalizationMap,
  Permissions,
} from 'discord.js'

export interface SlashCommand {
  name: string,
  description: string,
  name_localizations?: LocalizationMap,
  description_localizations?: LocalizationMap,
  options?: {
    name: string,
    description: string,
    name_localizations?: LocalizationMap,
    description_localizations?: LocalizationMap,
    type: OptionType,
    required?: boolean | false,
    autocomplete?: boolean | false,
    choices?: APIApplicationCommandOptionChoice<string | number>[],
    minLength?: number,
    maxLength?: number,
    minValue?: number,
    maxValue?: number,
    channelTypes?: OptionAllowedChannelType[],
  }[],
  default_member_permissions?: Permissions | null,
  dm_permission?: boolean | true,
  nsfw?: boolean | false,
  guilds?: string[],
  allowedUsers?: string[],
  cooldown?: CooldownOptions,
  callback: (interaction: CommandInteraction) => void,
  autocomplete?: (interaction: AutocompleteInteraction) => void,
}

type OptionType =
  | 'String'
  | 'Integer'
  | 'Number'
  | 'Boolean'
  | 'User'
  | 'Channel'
  | 'Role'
  | 'Mentionable'
  | 'Attachment'
  | 'Subcommand'
  | 'SubcommandGroup'

interface CooldownOptions {
  amount: number,
  multiplier: cooldownMultiplier,
  type?: CooldownType,
  ownerBypass?: boolean | false,
}

type cooldownMultiplier =
  | 'Seconds'
  | 'Minutes'
  | 'Hours'
  | 'Days'
  | 'Weeks'

type CooldownType =
  | 'Global'
  | 'Per Guild'
  | 'Per User Per Guild'
  | 'Per User Per DM'
  | 'Per User'


 interface AllowedChannelType {
  [key: string]: number
}

export const OptionAllowedChannelTypes: AllowedChannelType = {
  'Text':               ChannelType.GuildText,
  'Voice':              ChannelType.GuildVoice,
  'Category':           ChannelType.GuildCategory,
  'Announcment':        ChannelType.GuildAnnouncement,
  'AnnouncementThread': ChannelType.AnnouncementThread,
  'PublicThread':       ChannelType.PublicThread,
  'PrivateThread':      ChannelType.PrivateThread,
  'StageVoice':         ChannelType.GuildStageVoice,
  'Forum':              ChannelType.GuildForum,
  'Media':              ChannelType.GuildMedia,
}

type OptionAllowedChannelType =
  | 'Text'
  | 'Voice'
  | 'Category'
  | 'Announcment'
  | 'AnnouncementThread'
  | 'PublicThread'
  | 'PrivateThread'
  | 'StageVoice'
  | 'Forum'
  | 'Media'