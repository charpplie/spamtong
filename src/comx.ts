import { SlashCommandBuilder, CommandInteraction, Client, Collection } from 'discord.js'

export interface SlashCommand {
  data: SlashCommandBuilder | any
  callback: (interaction: CommandInteraction) => void,
  cooldown?: string,
  isOwnerOnly?: boolean | false
}

export interface Event {
  name: string,
  callback: (...args: any) => void,
}

export class CustomClient extends Client {
  public slashCommands!: Readonly<Collection<string, SlashCommand>>
  public cooldowns!: Readonly<Collection<string, number>>
}