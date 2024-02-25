import {
  APIApplicationCommandOptionChoice,
  AutocompleteInteraction,
  ChannelType,
  CommandInteraction,
  LocalizationMap,
  Permissions,
  PermissionFlagsBits
} from 'discord.js'

export default interface SlashCommand {
  /**
   * The name of this command.
   */
  name: string,
  /**
   * The name localizations of this command.
   */
  name_localizations?: LocalizationMap,
  /**
   * The description of this command.
   */
  description: string,
  /**
   * The description localizations of this command.
   */
  description_localizations?: LocalizationMap,
  /**
   * The options of this command.
   */
  options?: {
    /**
     * The name of this option.
     */
    name: string,
    /**
     * The name localizations of this option.
     */
    name_localizations?: LocalizationMap,
    /**
     * The description of this option.
     */
    description: string,
    /**
     * The description localizations of this option.
     */
    description_localizations?: LocalizationMap,
    /**
     * The type of this option.
     */
    type: OptionType,
    /**
     * Sets whether this option is required or not (false by default).
     */
    required?: boolean | false,
    /**
     * Whether this option uses autocomplete (false by default).
     */
    autocomplete?: boolean | false,
    /**
     * Predetermined values for this option (max 25).
     */
    choices?: APIApplicationCommandOptionChoice<string | number>[],
    /**
     * The minimum length of user input for the String option. Does not affect other types.
     */
    minLength?: number,
    /**
     * The maximum length of user input for the String option. Does not affect other types.
     */
    maxLength?: number,
    /**
     * The minimum value of user input for the Integer or Number options. Does not affect other types.
     */
    minValue?: number,
    /**
     * The maximum value of user input for the Integer or Number options. Does not affect other types.
     */
    maxValue?: number,
    /**
     * Limit the selection to certain types of channels for Channel option. Does not affect other types.
     */
    channelTypes?: OptionAllowedChannelType[],
  }[],
  /**
   * The set of permissions represented as a bit set for the command.
   */
  default_member_permissions?: Permissions | null,
  /**
   * Indicates whether the command is available in direct messages with the application.
   */
  dm_permission?: boolean | true,
  /**
   * Whether this command is NSFW (false by default).
   */
  nsfw?: boolean | false,
  /**
   * Whether this command is available only to the owner (false by default).
   */
  isOwnerOnly?: boolean | false,
  /**
   * A list of user IDs that can be used to run this command (if empty, then all users can execute this command). 
   */
  allowedUsers?: string[],
  /**
   * List of guild IDs in which this command is registered (if empty, then this is a global command).
   */
  guilds?: string[],
  cooldown?: CooldownOptions,
  callback: (interaction: CommandInteraction) => void,
  autocomplete?: (interaction: AutocompleteInteraction) => void,
}

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