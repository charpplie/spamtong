import { SlashCommandBuilder, CommandInteraction, Collection, AutocompleteInteraction } from 'discord.js'

export interface ISlashCommand {
  command: SlashCommandBuilder | any,
  execute: (interaction: CommandInteraction) => void,
  autoComplete?: (interaction: CommandInteraction) => void,
  cooldown?: number,
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, ISlashCommand>,
    cooldowns: Collection<string, number>,
  }
}