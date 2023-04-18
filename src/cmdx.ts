import 'dotenv/config'

import type { SlashCommandBuilder, Interaction } from 'discord.js'
import type { CustomClient, SlashCommand } from './types'

import { REST, Routes, Events } from 'discord.js'

import { readdir, lstat } from 'fs/promises'
import { join } from 'path'

export default async function (client: CustomClient, dir = 'commands') {
  const slashCommandsDir = join(__dirname, dir)

  const slashCommands: SlashCommandBuilder[] = []

  async function readCommands(t_dir: string) {
    const files = await readdir(t_dir)
    for (const file of files) {
      const filePath = join(t_dir, file)
      const fileStat = await lstat(filePath)

      if (fileStat.isDirectory()) {
        await readCommands(filePath)
        continue
      }

      if (!file.endsWith('.ts')) {
        console.error(`Invalid file type: ${file}`)
        continue
      }

      const commandModule = await import(filePath)
      if (!commandModule?.default?.command) {
        console.error(`Invalid slash command module: ${file}`)
        continue
      }

      const command: SlashCommand = commandModule.default
      const { name } = command.command
      client.slashCommands.set(name, command)
      slashCommands.push(command.command)
    }
  }

  await readCommands(slashCommandsDir)

  try {
    const rest = new REST({ version: '10' }).setToken(String(process.env.token))
    await rest.put(Routes.applicationCommands(String(process.env.clientId)), {
      body: slashCommands,
    })
    console.log(`Successfully loaded ${slashCommands.length} slash commands`)
  } catch (error) {
    console.error(`Error loading slash commands: ${error}`)
  }

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isCommand()) return

    const command = client.slashCommands.get(interaction.commandName)
    if (!command) return

    if (command.isOwnerOnly && interaction.user.id !== '783443296382746672') {
      await interaction.reply({ content: 'This command is only available to the owner', ephemeral: true})
      return
    }

    command.execute(interaction)
  })
}
