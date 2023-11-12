import { CustomClient, SlashCommand, Event } from './comx'
import { SlashCommandBuilder, Interaction, Collection, Events } from 'discord.js'
import config from '.'

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
        client.users.send(String(config.ownId), `Error importing ${file}: ${error}`)
        continue
      }

      if (!commandFile?.default?.name && !commandFile?.default?.description) {
        client.users.send(String(config.ownId), `Invalid slash command: ${file}`)
        continue
      }

      const command: SlashCommand = commandFile.default
      const data = new SlashCommandBuilder().setName(command.name).setDescription(command.description)
      client.commands.set(command.name, command)
      slashCommands.push(data)
    }
  }

  await readSlashCommands(slashCommandsDir)

  try {
    const rest = new REST({ version: '10' }).setToken(String(config.token))
    await rest.put(Routes.applicationCommands(String(config.appId)), { body: slashCommands })
  } catch (error) { client.users.send(String(config.ownId), `Error loading slash command: ${error}`) }

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    // const { cooldowns } = client

    // if (!cooldowns.has(command.name)) {
    //   cooldowns.set(command.name, new Collection<string, number>() as any)
    // }

    // const now = Date.now()
    // const timestamps: any = cooldowns.get(command.name)
    // const defaultCooldown = '5' as any
    // const cooldownString = command.cooldown ?? defaultCooldown
    // const cooldownNumber = parseInt(cooldownString.slice(0, -1))
    // const cooldownType = cooldownString.slice(-1).toLowerCase()
    // let cooldownAmount = 0

    // switch (cooldownType) {
    //   case "s":
    //     cooldownAmount = cooldownNumber * 1000
    //     break
    //   case "m":
    //     cooldownAmount = cooldownNumber * 60 * 1000
    //     break
    //   case "h":
    //     cooldownAmount = cooldownNumber * 60 * 60 * 1000
    //     break
    //   case "d":
    //     cooldownAmount = cooldownNumber * 24 * 60 * 60 * 1000
    //     break
    // }

    // if (timestamps.has(interaction.user.id)) {
    //   const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount

    //   if (now < expirationTime) {
    //     const expiredTimestamp = Math.round(expirationTime / 1000)
    //     interaction.reply({
    //       content: `Please be patient! You are on a cooldown for ${command.name}. You can use it again <t:${expiredTimestamp}:R>`,
    //       ephemeral: true,
    //     })
    //     return
    //   }
    // }

    // timestamps.set(interaction.user.id, now)
    // setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

    // if (command.isOwnerOnly && interaction.user.id != '783443296382746672') return

    try {
      command.callback(interaction)
    } catch (error) { client.users.send(String(config.ownId), `Error executing slash command ${command.name}: ${error}`) }
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
          } catch (error) { client.users.send(String(config.ownId), `Error executing event ${String(event.name)}: ${String(error)}`) }
        })
      } catch (error) { client.users.send(String(config.ownId), `Error loading event file ${String(filePath)}: ${String(error)}`) }
    }
  }
  await readEvents(dir)
}
