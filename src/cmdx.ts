import 'dotenv/config'

import type { SlashCommandBuilder, Interaction } from 'discord.js'
import type { CustomClient, ISlashCommand } from './types'

import { Routes, REST, Events } from 'discord.js'
import { readdir } from 'fs/promises'
import { join } from 'path'

export default async function (client: CustomClient) {
  const slashCommandsDir = join(__dirname, './commands')

  const slashCommands: SlashCommandBuilder[] = []
  for (const file of await readdir(slashCommandsDir)) {
    if (!file.endsWith('.ts')) continue
    const commandModule = await import(`${slashCommandsDir}/${file}`)
    if (!commandModule?.default?.command) {
      console.error(`Invalid slash command module: ${file}`)
      continue
    }
    const command: ISlashCommand = commandModule.default
    const { name } = command.command
    client.slashCommands.set(name, command)
    slashCommands.push(command.command)
  }

  try {
    const rest = new REST({ version: '10' }).setToken(String(process.env.token))
    await rest.put(Routes.applicationCommands(String(process.env.clientId)), {
      body: slashCommands.map(command => command.toJSON()),
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
