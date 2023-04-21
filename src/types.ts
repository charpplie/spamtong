import { SlashCommandBuilder, CommandInteraction, Client, Collection } from 'discord.js'

export interface SlashCommand {
  command: SlashCommandBuilder | any
  execute: (interaction: CommandInteraction) => void
}

export class CustomClient extends Client { public slashCommands!: Readonly<Collection<string, SlashCommand>> }
