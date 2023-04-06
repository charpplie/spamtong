// Copyright (C) Thawnezilla 2023

import { Client, Collection, SlashCommandBuilder, CommandInteraction } from 'discord.js'

export interface ISlashCommand {
  command: SlashCommandBuilder | any
  execute: (interaction: CommandInteraction) => void
  cooldown: number
}

export class CustomClient extends Client {
  public slashCommands: Readonly<Collection<string, ISlashCommand>>
  public cooldowns: Readonly<Collection<string, number>>
}
