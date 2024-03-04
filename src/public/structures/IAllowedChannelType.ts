import { ChannelType } from 'discord.js'

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

export type OptionAllowedChannelType =
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