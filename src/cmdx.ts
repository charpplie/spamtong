import 'dotenv/config'

import type { SlashCommandBuilder, Interaction } from 'discord.js'
import type { CustomClient, SlashCommand } from './types'

import { REST, Routes, Events } from 'discord.js'

import { readdir, lstat } from 'fs/promises'
import { join } from 'path'

/**
 * Registers slash commands to a Discord bot.
 *
 * @param client The Discord bot client instance.
 * @param dir The directory containing the slash command files ("./commands" by default).
 */
export async function ppSlashCommandHandler(client: CustomClient, dir = 'commands') {
  const slashCommandsDir = join(__dirname, dir)

  const slashCommands: SlashCommandBuilder[] = []

  async function readSlashCommands(directoryPath: string) {
    const files = (await readdir(directoryPath)).filter((file) => file.endsWith('.ts'))

    for (const file of files) {
      const filePath = join(directoryPath, file)
      const fileStat = await lstat(filePath)

      if (fileStat.isDirectory()) {
        await readSlashCommands(filePath)
        continue
      }

      let commandFile: { default?: SlashCommand } = {}

      try {
        commandFile = await import(filePath)
      } catch (err) {
        console.error(`Error importing ${file}: ${err}`)
        continue
      }

      if (!commandFile?.default?.command) {
        console.error(`Invalid slash command: ${file}`)
        continue
      }

      const command: SlashCommand = commandFile.default
      const { name } = command.command
      client.slashCommands.set(name, command)
      slashCommands.push(command.command)
    }
  }

  await readSlashCommands(slashCommandsDir)

  try {
    const rest = new REST({ version: '10' }).setToken(String(process.env.token))
    await rest.put(Routes.applicationCommands(String(process.env.clientId)), {
      body: slashCommands,
    })
    console.log(`Successfully loaded ${slashCommands.length} slash commands`)
  } catch (err) { console.error(`Error loading slash commands: ${err}`) }

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isCommand()) return

    const command = client.slashCommands.get(interaction.commandName)
    if (!command) return

    command.execute(interaction)
  })
}
