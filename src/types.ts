import { Client, Collection, SlashCommandBuilder, CommandInteraction } from 'discord.js'

export interface ISlashCommand {
  command: SlashCommandBuilder | any
  execute: (interaction: CommandInteraction) => void
}

export class CustomClient extends Client { public slashCommands!: Readonly<Collection<string, ISlashCommand>> }
