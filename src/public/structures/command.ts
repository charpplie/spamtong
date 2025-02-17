import {
  APIApplicationCommandOptionChoice,
  AutocompleteInteraction,
  ChannelType,
  CommandInteraction,
  LocalizationMap
} from 'discord.js'
import { Jukai } from '../classes/jukai'

export interface Command {
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
  default_member_permissions?: string | bigint | number | null | undefined,
  dm_permission?: boolean | true,
  nsfw?: boolean | false,
  guilds?: string[],
  allowedUsers?: string[],
  isOwnerOnly?: boolean | false,
  cooldown?: CooldownOptions,
  callback: (interaction: CommandInteraction, instance: Jukai) => void,
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
  multiplier: CooldownMultiplier,
  type?: CooldownType,
  ownerBypass?: boolean | false,
}

type CooldownMultiplier =
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

export const OptionAllowedChannelTypes: { [key: string]: number } = {
  'Text': ChannelType.GuildText,
  'Voice': ChannelType.GuildVoice,
  'Category': ChannelType.GuildCategory,
  'Announcment': ChannelType.GuildAnnouncement,
  'AnnouncementThread': ChannelType.AnnouncementThread,
  'PublicThread': ChannelType.PublicThread,
  'PrivateThread': ChannelType.PrivateThread,
  'StageVoice': ChannelType.GuildStageVoice,
  'Forum': ChannelType.GuildForum,
  'Media': ChannelType.GuildMedia,
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