// Copyright (C) Thawnezilla 2023

import 'dotenv/config'
import { SlashCommandBuilder, Routes, REST, Interaction, Events } from 'discord.js'
import { CustomClient, ISlashCommand } from './types'
import { readdirSync } from 'fs'
import { join } from 'path'

export default async function(client: CustomClient) {
  const slashCommands: SlashCommandBuilder[] = []

  const slashCommandsDir = join(__dirname, './commands')

  for (const file of readdirSync(slashCommandsDir)) {
    if (!file.endsWith('.ts')) continue
    const commandModule = await import(`${slashCommandsDir}/${file}`)
    if (!commandModule || !commandModule.default || !commandModule.default.command) {
      console.error(`Invalid slash command module: ${file}`)
      continue
    }
    const command: ISlashCommand = commandModule.default
    slashCommands.push(command.command)
    client.slashCommands.set(command.command.name, command)
  }

  try {
    const rest = new REST({ version: '10' }).setToken(String(process.env.token))
    await rest.put(Routes.applicationCommands(String(process.env.clientId)), {
      body: slashCommands.map(command => command.toJSON())
    })
    console.log(`Successfully loaded ${slashCommands.length} slash commands`)
  } catch (error) {
    console.error(`Error loading slash commands: ${error}`)
  }

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isCommand()) return

    const command = client.slashCommands.get(interaction.commandName)

    if (!command) return

    try {
      command.execute(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({ content: 'An error occurred while executing the command', ephemeral: true })
    }
  })
}
