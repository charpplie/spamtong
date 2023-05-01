import 'dotenv/config'

import { CustomClient, IEvent, SlashCommand, CEvents, ISlashCommandHandlerOptions } from './comx'
import { SlashCommandBuilder, Interaction, Collection } from 'discord.js'

import { REST, Routes } from 'discord.js'

import { readdir, lstat, access } from 'fs/promises'
import { join } from 'path'

export async function ppSlashCommandHandler(client: CustomClient, options: ISlashCommandHandlerOptions): Promise<void> {
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
      client.slashCommands.set(name, command)
      slashCommands.push(command.data)
    }
  }

  for (const dir of options.commandsDir) {
    const slashCommandsDir = join(__dirname, dir)

    try {
      await access(slashCommandsDir)
    } catch (error) {
      console.error(`${slashCommandsDir} doesn't exist`)
      continue
    }

    await readSlashCommands(slashCommandsDir)
  }

  try {
    const rest = new REST({ version: '10' }).setToken(String(process.env.token))
    await rest.put(Routes.applicationCommands(String(process.env.clientId)), {
      body: slashCommands,
    })
    console.log(`Successfully loaded ${slashCommands.length} slash commands`)
  } catch (error) { console.error(`Error loading slash commands: ${error}`) }

  client.on(CEvents.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isCommand()) return

    const command = client.slashCommands.get(interaction.commandName)
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
      default:
        cooldownAmount = defaultCooldown * 1000
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

    if (command.isOwnerOnly && !options.ownerId) {
      console.error(`[${command.data.name}] The command has an isOwnerOnly field, but the owner identifier is not specified. The command will not be executed.`)
      return
    }

    if (command.isOwnerOnly && !options.ownerId?.includes(interaction.user.id)) {
      interaction.reply({
        content: 'This command can only be used by the owner(s)',
        ephemeral: true,
      })
    }

    try {
      command.execute(interaction)
    } catch (error) { console.error(`Error executing slash command ${command.data.name}: ${error}`) }
  })
}

export async function ppEventHandler(client: CustomClient, dirs: string[] = ['events']): Promise<void> {
  for (const dir of dirs) {
    const eventsDir: string = join(__dirname, dir)

    try {
      await access(eventsDir)
    } catch (error) {
      console.error(`${eventsDir} doesn't exist`)
      return
    }

    async function readEvents(directoryPath: string) {
      const files: string[] = (await readdir(directoryPath)).filter((file: string) => file.endsWith('.ts'))

      for (const file of files) {
        const filePath = join(directoryPath, file)
        const fileStat = await lstat(filePath)

        if (fileStat.isDirectory()) {
          await readEvents(filePath)
          continue
        }

        try {
          const event: IEvent = (await import(`${filePath}`)).default

          if (event.once) {
            client.once(event.name, async (...args: any[]) => {
              try {
                event.execute(...args)
              } catch (error) { console.error(`Error executing event ${event.name}: ${error}`) }
            })
          } else {
            client.on(event.name, async (...args: any[]) => {
              try {
                event.execute(...args)
              } catch (error) { console.error(`Error executing event ${event.name}: ${error}`) }
            })
          }

          console.log(`Successfully loaded event ${event.name} from ${filePath}`)
        } catch (error) { console.error(`Error loading event file ${filePath}: ${error}`) }
      }
    }

    await readEvents(eventsDir)
  }
}
