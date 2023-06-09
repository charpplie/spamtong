import 'dotenv/config'

import { CustomClient, SlashCommand, Event } from './comx'
import { SlashCommandBuilder, Interaction, Collection, Events } from 'discord.js'

import { REST, Routes } from 'discord.js'

import { readdir, lstat } from 'fs/promises'
import { join } from 'path'

export async function SlashCommandHandler(client: CustomClient, dir: string) {
  const slashCommandsDir = dir
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
      } catch (error) {
        console.error(`Error importing ${file}: ${error}`)
        continue
      }

      if (!commandFile?.default?.data) {
        console.error(`Invalid slash command: ${file}`)
        continue
      }

      const command: SlashCommand = commandFile.default
      const { name } = command.data
      client.commands.set(name, command)
      slashCommands.push(command.data)
    }
  }

  await readSlashCommands(slashCommandsDir)

  try {
    const rest = new REST({ version: '10' }).setToken(String(process.env.token))
    await rest.put(Routes.applicationCommands(String(process.env.appid)), { body: slashCommands })
  } catch (error) { console.error(`Error loading slash command: ${error}`) }

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    const { cooldowns } = client

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection<string, number>() as any)
    }

    const now = Date.now()
    const timestamps: any = cooldowns.get(command.data.name)
    const defaultCooldown = '5' as any
    const cooldownString = command.cooldown ?? defaultCooldown
    const cooldownNumber = parseInt(cooldownString.slice(0, -1))
    const cooldownType = cooldownString.slice(-1).toLowerCase()
    let cooldownAmount = 0

    switch (cooldownType) {
      case "s":
        cooldownAmount = cooldownNumber * 1000
        break
      case "m":
        cooldownAmount = cooldownNumber * 60 * 1000
        break
      case "h":
        cooldownAmount = cooldownNumber * 60 * 60 * 1000
        break
      case "d":
        cooldownAmount = cooldownNumber * 24 * 60 * 60 * 1000
        break
    }

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000)
        interaction.reply({
          content: `Please be patient! You are on a cooldown for ${command.data.name}. You can use it again <t:${expiredTimestamp}:R>`,
          ephemeral: true,
        })
        return
      }
    }

    timestamps.set(interaction.user.id, now)
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

    if (command.isOwnerOnly && interaction.user.id != '783443296382746672') return

    try {
      command.callback(interaction)
    } catch (error) { console.error(`Error executing slash command ${command.data.name}: ${error}`) }
  })
}

export async function EventHandler(client: CustomClient, dir: string) {
  async function readEvents(dir: string) {
    const files: string[] = (await readdir(dir))

    for (const file of files) {
      const filePath = join(dir, file)
      const fileStat = await lstat(filePath)

      if (fileStat.isDirectory()) {
        await readEvents(filePath)
        continue
      }

      try {
        const event: Event = (await import(`${filePath}`)).default

        client.on(event.name, async (...args: any[]) => {
          try {
            event.callback(...args)
          } catch (error) { console.error(`Error executing event ${event.name}: ${error}`) }
        })
      } catch (error) { console.error(`Error loading event file ${filePath}: ${error}`) }
    }
  }

  await readEvents(dir)
}
