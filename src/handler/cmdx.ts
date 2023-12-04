import { cmdx_locale } from 'locale'
import { APIApplicationCommandOptionChoice, SlashCommandBuilder, Interaction, REST, Routes, Collection } from 'discord.js'
import { CustomClient, SlashCommand, Event, Events } from '@/comx'
import { readdir, lstat } from 'fs/promises'
import { g_Logger } from 'logger'
import { join } from 'path'

interface IGuildCommands {
  [guild: string]: SlashCommandBuilder[]
}

export async function SlashCommandHandler(client: CustomClient, commandsDir: string) {
  const slashCommandsGlobal: SlashCommandBuilder[] = []
  const slashCommandsGuilds: SlashCommandBuilder[] = []

  async function readSlashCommands(dir: string) {
    const files = await readdir(dir)

    for (const file of files) {
      const filePath = join(dir, file)
      const fileStat = await lstat(filePath)

      if (fileStat.isDirectory()) {
        await readSlashCommands(filePath)
        continue
      }

      let commandFile: { default?: SlashCommand } = {}

      try {
        commandFile = await import(filePath)
      } catch (error) {
        g_Logger.error(`Error importing ${file}: ${error}`)
        continue
      }

      if (!commandFile?.default?.name && !commandFile?.default?.description) {
        g_Logger.error(`Invalid slash command: ${file}`)
        continue
      }

      const command: SlashCommand = commandFile.default
      client.commands.set(command.name, command)

      const data = new SlashCommandBuilder().setName(command.name).setDescription(command.description)

      if (command.name_localizations) {
        data.setNameLocalizations(command.name_localizations)
      }

      if (command.description_localizations) {
        data.setDescriptionLocalizations(command.description_localizations)
      }

      if (command.options) {
        command.options.forEach((option) => {
          const { name, description, type, required, choices, minValue, maxValue } = option
          switch (type) {
            case 'STRING':
              data.addStringOption(optionData =>
                optionData
                  .setName(name)
                  .setDescription(description)
                  .setRequired(required || false)
                  .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<string>[] : []))
              )
              break
            case 'INTEGER':
              if (minValue !== undefined && maxValue !== undefined) {
                data.addIntegerOption(optionData =>
                  optionData
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required || false)
                    .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                    .setMinValue(minValue)
                    .setMaxValue(maxValue)
                )
              } else if (minValue !== undefined) {
                data.addIntegerOption(optionData =>
                  optionData
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required || false)
                    .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                    .setMinValue(minValue)
                )
              } else if (maxValue !== undefined) {
                data.addIntegerOption(optionData =>
                  optionData
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required || false)
                    .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                    .setMaxValue(maxValue)
                )
              } else {
                data.addIntegerOption(optionData =>
                  optionData
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required || false)
                    .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                )
              }
              break
            case 'NUMBER':
              if (minValue !== undefined && maxValue !== undefined) {
                data.addNumberOption(optionData =>
                  optionData
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required || false)
                    .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                    .setMinValue(minValue)
                    .setMaxValue(maxValue)
                )
              } else if (minValue !== undefined) {
                data.addNumberOption(optionData =>
                  optionData
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required || false)
                    .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                    .setMinValue(minValue)
                )
              } else if (maxValue !== undefined) {
                data.addNumberOption(optionData =>
                  optionData
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required || false)
                    .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                    .setMaxValue(maxValue)
                )
              } else {
                data.addNumberOption(optionData =>
                  optionData
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required || false)
                    .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                )
              }
              break
            case 'BOOLEAN':
              data.addBooleanOption(optionData =>
                optionData
                  .setName(name)
                  .setDescription(description)
                  .setRequired(required || false)
              )
              break
            case 'USER':
              data.addUserOption(optionData =>
                optionData
                  .setName(name)
                  .setDescription(description)
                  .setRequired(required || false)
              )
              break
            case 'CHANNEL':
              data.addChannelOption(optionData =>
                optionData
                  .setName(name)
                  .setDescription(description)
                  .setRequired(required || false)
              )
              break
            case 'ROLE':
              data.addRoleOption(optionData =>
                optionData
                  .setName(name)
                  .setDescription(description)
                  .setRequired(required || false)
              )
              break
            case 'MENTIONABLE':
              data.addMentionableOption(optionData =>
                optionData
                  .setName(name)
                  .setDescription(description)
                  .setRequired(required || false)
              )
              break
            case 'ATTACHMENT':
              data.addStringOption(optionData =>
                optionData
                  .setName(name)
                  .setDescription(description)
                  .setRequired(required  || false)
              )
              break
            case 'SUBCOMMAND':
              data.addSubcommand(subcommand =>
                subcommand
                  .setName(name)
                  .setDescription(description)
              )
              break
            case 'SUBCOMMAND_GROUP':
              data.addSubcommandGroup(subcommandGroup =>
                subcommandGroup
                  .setName(name)
                  .setDescription(description)
              )
              break
          }
        })
      }

      if (command.guilds) {
        slashCommandsGuilds.push(data)
      } else {
        slashCommandsGlobal.push(data)
      }
    }
  }

  await readSlashCommands(commandsDir)

  try {
    const rest = new REST({ version: '10' }).setToken(String(process.env.token))

    if (slashCommandsGlobal) {
      await rest.put(Routes.applicationCommands(String(process.env.appId)), { body: slashCommandsGlobal, })
    }

    if (slashCommandsGuilds) {
      const guildCommands: IGuildCommands = {}

      slashCommandsGuilds.forEach(async (com) => {
        const command = client.commands.get(com.name)

        if (command && command.guilds) {
          command.guilds.forEach(async (guild) => {
            if (!guildCommands[guild]) {
              guildCommands[guild] = []
            }

            guildCommands[guild].push(com)
          })
        }
      })

      for (const guild in guildCommands) {
        await rest.put(Routes.applicationGuildCommands(String(process.env.appId), guild), { body: guildCommands[guild], })
      }
    }
  } catch (error) {
    g_Logger.error(`Error loading slash command: ${error}`)
  }

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    const { cooldowns } = client
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection<string, number>() as any)
    }
    const now = Date.now()
    const timestamps: any = cooldowns.get(command.name)
    const cooldownString = command.cooldown ?? '0'
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
          content: cmdx_locale[interaction.locale] ? cmdx_locale[interaction.locale].replace('${command.name}', command.name).replace('${expiredTimestamp}', String(expiredTimestamp)) : cmdx_locale['en-US'].replace('${command.name}', command.name).replace('${expiredTimestamp}', String(expiredTimestamp)),
          ephemeral: true,
        })
        return
      }
    }
    timestamps.set(interaction.user.id, now)
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

    if (command.isOwnerOnly && interaction.user.id != process.env.owner) return
    if (command.allowedUsers && !command.allowedUsers.includes(interaction.user.id)) return

    try {
      command.callback(interaction)
    } catch (error) {
      g_Logger.error(`Error executing slash command ${command.name}: ${error}`)
    }
  })
}

export async function EventHandler(client: CustomClient, eventsDir: string) {
  async function readEvents(dir: string) {
    const files: string[] = await readdir(dir)

    await Promise.all(
      files.map(async (file) => {
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
              try { event.callback(...args) } catch (error) { await handleEventError(event, error) }
            })
          } else {
            client.on(event.name, async (...args: any[]) => {
              try { event.callback(...args) } catch (error) { await handleEventError(event, error) }
            })
          }
        } catch (error) {
          await handleEventError(filePath, error)
        }
      })
    )
  }

  await readEvents(eventsDir)

  async function handleEventError(eventData: string | Event, error: any) {
    g_Logger.error(`Error ${eventData instanceof Event ? 'executing' : 'loading'} event ${eventData}: ${error}`)
   }
}