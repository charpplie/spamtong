import { SlashCommandBuilder, Interaction, REST, Routes, Collection } from 'discord.js'
import { CustomClient, SlashCommand, Event, Events } from './comx'
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
        client.users.send(String(process.env.owner), `Error importing ${file}: ${error}`)
        continue
      }

      if (!commandFile?.default?.name && !commandFile?.default?.description) {
        client.users.send(String(process.env.owner), `Invalid slash command: ${file}`)
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
    const rest = new REST({ version: '10' }).setToken(String(process.env.token))
    await rest.put(Routes.applicationGuildCommands(String(process.env.appId), '1150427580734906368'), { body: slashCommands })
  } catch (error) { client.users.send(String(process.env.ownId), `Error loading slash command: ${error}`) }

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

    // if (command.isOwnerOnly && interaction.user.id != config.owner) return

    try {
      command.callback(interaction)
    } catch (error) { client.users.send(String(process.env.owner), `Error executing slash command ${command.name}: ${error}`) }
  })
}

export async function EventHandler(client: CustomClient, dir: string) {
  async function readEvents(dir: string) {
    const files: string[] = await readdir(dir)

    await Promise.all(files.map(async (file) => {
      const filePath = join(dir, file)
      const fileStat = await lstat(filePath)

      if (fileStat.isDirectory()) {
        await readEvents(filePath)
        return
      }

      try {
        const event: Event = (await import(filePath)).default
        if (event.once) {
          client.once(event.name, async (...args: any[]) => {
            try { event.callback(...args) } catch (error) { await handleEventError(client, event, error) }
          })
        } else {
          client.on(event.name, async (...args: any[]) => {
            try { event.callback(...args) } catch (error) { await handleEventError(client, event, error) }
          })
        }
      } catch (error) { await handleEventError(client, filePath, error) }
    }))
  }

  async function handleEventError(client: CustomClient, eventData: string | Event, error: any) {
    const errMsg = `Error ${eventData instanceof Event ? 'executing' : 'loading'} event ${eventData}: ${error}`
    client.users.send(String(process.env.owner), errMsg)
  }

  await readEvents(dir)
}