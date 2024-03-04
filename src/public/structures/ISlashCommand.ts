import {
  APIApplicationCommandOptionChoice,
  AutocompleteInteraction,
  CommandInteraction,
  LocalizationMap,
  Permissions,
} from 'discord.js'

import { CooldownOptions } from './ICooldownOptions'
import { OptionAllowedChannelType } from './IAllowedChannelType'

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