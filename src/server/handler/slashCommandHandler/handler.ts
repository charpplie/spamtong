import { APIApplicationCommandOptionChoice, Client, Collection, CommandInteraction, Interaction, REST, Routes, SlashCommandBuilder } from "discord.js"
import { OptionAllowedChannelTypes, SlashCommand } from "./command"
import { readdirSync } from "fs"
import { join } from "path"

export class SlashCommandHandler {
  private client: Client
  private token: string
  private appId: string
  private owner: string
  private commands: Collection<string, SlashCommand> = new Collection<string, SlashCommand>()
  private cooldowns: Collection<string, number> = new Collection<string, number>()
  private slashCommandsGlobal: SlashCommandBuilder[] = []
  private slashCommandsGuilds: SlashCommandBuilder[] = []

  public constructor(options: Options) {
    const {
      client,
      token,
      appId,
      owner,
      commandsDir
    } = options

    this.client = client
    this.token = token
    this.appId = appId
    this.owner = owner

    this.client.on('ready', async () => {
      this.readSlashCommands(commandsDir).then(() => this.registerSlashCommands())
    })
  }

  private async readSlashCommands(commandsDir: string[]) {
    const __readSlashCommands = async (dir: string) => {
      const files = readdirSync(dir, {
        withFileTypes: true,
      })

      for (const file of files) {
        const filePath = join(dir, file.name)

        if (file.name.charAt(0) === '!') continue
        if (!file.isDirectory() && !file.name.endsWith('.ts')) continue
        if (file.isDirectory()) { await __readSlashCommands(filePath); continue }

        const command = (await import(filePath)).default
        if (command) this.commands.set(command.name, command)

        const data = new SlashCommandBuilder().setName(command.name).setDescription(command.description)
        this.assignCommandInfo(command, data)

        if (command.guilds) this.slashCommandsGuilds.push(data)
        else this.slashCommandsGlobal.push(data)
      }
    }

    for (const commandDir of commandsDir) await __readSlashCommands(commandDir)
  }

  private async registerSlashCommands() {
    const rest = new REST({ version: '10' }).setToken(this.token)

    if (this.slashCommandsGlobal) await rest.put(Routes.applicationCommands(`${this.appId}`), { body: this.slashCommandsGlobal, })

    if (this.slashCommandsGuilds) {
      const guildCommands: IGuildCommands = {}

      this.slashCommandsGuilds.forEach(async (_commmand) => {
        const command = this.commands.get(_commmand.name)

        if (command && command.guilds) {
          command.guilds.forEach(async (guild) => {
            if (!guildCommands[guild]) guildCommands[guild] = []
            guildCommands[guild].push(_commmand)
          })
        }
      })

      for (const guild in guildCommands) await rest.put(Routes.applicationGuildCommands(`${this.appId}`, guild), { body: guildCommands[guild] })
    }

    this.client.on('interactionCreate', async (interaction: Interaction) => {
      if (interaction.isCommand()) {
        const command = this.commands.get(interaction.commandName)
        if (!command) return

        if (command.isOwnerOnly && interaction.user.id !== this.owner) return
        if (command.allowedUsers && !command.allowedUsers.includes(interaction.user.id)) return

        if (await this.checkcooldowns(command, interaction)) command.callback(interaction as CommandInteraction)
      } else if (interaction.isAutocomplete()) {
        const command = this.commands.get(interaction.commandName)
        if (!command || !command.autocomplete) return
  
        try { await command.autocomplete(interaction) } catch (why) {}
      }
    })
  }

  private async checkcooldowns(command: SlashCommand, interaction: CommandInteraction): Promise<boolean> {
    if (!command.cooldown) return true

    if (command.cooldown.ownerBypass && interaction.user.id === this.owner) return true

    if (!this.cooldowns.has(command.name)) this.cooldowns.set(command.name, new Collection<string, number[]>() as any)

    const { amount, multiplier, type } = command.cooldown

    let cooldownKey: string
    switch (type) {
      case 'Global': {
        cooldownKey = 'global'
        break
      }
      case 'Per Guild': {
        if (interaction.guild !== null) cooldownKey = `${interaction.guildId}`
        else return true
        break
      }
      case 'Per User Per Guild': {
        if (interaction.guild !== null) cooldownKey = `${interaction.guildId}${interaction.user.id}`
        else return true
        break
      }
      case 'Per User Per DM': {
        if (interaction.guild === null) cooldownKey = `DM${interaction.user.id}`
        else return true
        break
      }
      case 'Per User': {
        cooldownKey = `${interaction.user.id}`
        break
      }
      default: {
        cooldownKey = `${interaction.guildId}${interaction.user.id}`
        break
      }
    }

    const timestamps: any = this.cooldowns.get(command.name)
    const now = Date.now()
    if (timestamps.has(cooldownKey)) {
      const end = timestamps.get(cooldownKey)[1]
      if (now < end) {
        await interaction.reply({
          content: `Please be patient! You will be able to use ${command.name} again <t:${Math.round(end / 1000)}:R>`,
          ephemeral: true,
        })

        return false
      }
    } else {
      let cooldownAmount = 0
      switch (multiplier) {
        case 'Seconds': {
          cooldownAmount = amount * 1000
          break
        }
        case 'Minutes': {
          cooldownAmount = amount * 60 * 1000
          break
        }
        case 'Hours': {
          cooldownAmount = amount * 60 * 60 * 1000
          break
        }
        case 'Days': {
          cooldownAmount = amount * 24 * 60 * 60 * 1000
          break
        }
        case 'Weeks': {
          cooldownAmount = amount * 7 * 24 * 60 * 60 * 1000
          break
        }
      }

      timestamps.set(cooldownKey, [now, now + cooldownAmount])
      setTimeout(() => timestamps.delete(cooldownKey), cooldownAmount)
    }

    return true
  }

  private assignCommandInfo(command: SlashCommand, data: SlashCommandBuilder) {
    if (command.name_localizations) data.setNameLocalizations(command.name_localizations)

    if (command.description_localizations) data.setDescriptionLocalizations(command.description_localizations)

    if (command.options) this.assingCommandOptions(command, data)

    if (command.default_member_permissions) data.setDefaultMemberPermissions(command.default_member_permissions)

    if (command.dm_permission) data.setDMPermission(command.dm_permission)

    if (command.nsfw) data.setNSFW(command.nsfw)
  }

  private assingCommandOptions(command: SlashCommand, data: SlashCommandBuilder) {
    if (!command.options) return

    command.options.forEach((option) => {
      const { name, name_localizations, description, description_localizations, type, required, choices, maxLength, minLength, maxValue, minValue, channelTypes, autocomplete } = option
      switch (type) {
        case 'String': {
          if (minLength !== undefined && maxLength !== undefined) {
            data.addStringOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<string>[] : []))
                .setMinLength(minLength)
                .setMaxLength(maxLength)
            )
          } else if (minLength !== undefined) {
            data.addStringOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<string>[] : []))
                .setMinLength(minLength)
            )
          } else if (maxLength !== undefined) {
            data.addStringOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<string>[] : []))
                .setMaxLength(maxLength)
            )
          } else {
            data.addStringOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<string>[] : [])),
            )
          }
          break
        }
        case 'Integer': {
          if (minValue !== undefined && maxValue !== undefined) {
            data.addIntegerOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                .setMinValue(minValue)
                .setMaxValue(maxValue)
            )
          } else if (minValue !== undefined) {
            data.addIntegerOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                .setMinValue(minValue)
            )
          } else if (maxValue !== undefined) {
            data.addIntegerOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                .setMaxValue(maxValue)
            )
          } else {
            data.addIntegerOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
            )
          }
          break
        }
        case 'Number': {
          if (minValue !== undefined && maxValue !== undefined) {
            data.addNumberOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                .setMinValue(minValue)
                .setMaxValue(maxValue)
            )
          } else if (minValue !== undefined) {
            data.addNumberOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                .setMinValue(minValue)
            )
          } else if (maxValue !== undefined) {
            data.addNumberOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
                .setMaxValue(maxValue)
            )
          } else {
            data.addNumberOption(optionData =>
              optionData
                .setName(name)
                .setNameLocalizations((name_localizations? name_localizations : {}))
                .setDescription(description)
                .setDescriptionLocalizations((description_localizations? description_localizations : {}))
                .setRequired(required || false)
                .setAutocomplete(autocomplete || false)
                .addChoices(...(choices ? choices as APIApplicationCommandOptionChoice<number>[] : []))
            )
          }
          break
        }
        case 'Boolean':
          data.addBooleanOption(optionData =>
            optionData
              .setName(name)
              .setNameLocalizations((name_localizations? name_localizations : {}))
              .setDescription(description)
              .setDescriptionLocalizations((description_localizations? description_localizations : {}))
              .setRequired(required || false)
          )
          break
        case 'User':
          data.addUserOption(optionData =>
            optionData
              .setName(name)
              .setNameLocalizations((name_localizations? name_localizations : {}))
              .setDescription(description)
              .setDescriptionLocalizations((description_localizations? description_localizations : {}))
              .setRequired(required || false)
          )
          break
        case 'Channel':
          data.addChannelOption(optionData =>
            optionData
              .setName(name)
              .setNameLocalizations((name_localizations? name_localizations : {}))
              .setDescription(description)
              .setDescriptionLocalizations((description_localizations? description_localizations : {}))
              .setRequired(required || false)
              .addChannelTypes(...(channelTypes ? channelTypes.map(channelType => OptionAllowedChannelTypes[channelType]) : []))
          )
          break
        case 'Role':
          data.addRoleOption(optionData =>
            optionData
              .setName(name)
              .setNameLocalizations((name_localizations? name_localizations : {}))
              .setDescription(description)
              .setDescriptionLocalizations((description_localizations? description_localizations : {}))
              .setRequired(required || false)
          )
          break
        case 'Mentionable':
          data.addMentionableOption(optionData =>
            optionData
              .setName(name)
              .setNameLocalizations((name_localizations? name_localizations : {}))
              .setDescription(description)
              .setDescriptionLocalizations((description_localizations? description_localizations : {}))
              .setRequired(required || false)
          )
          break
        case 'Attachment':
          data.addAttachmentOption(optionData =>
            optionData
              .setName(name)
              .setNameLocalizations((name_localizations? name_localizations : {}))
              .setDescription(description)
              .setDescriptionLocalizations((description_localizations? description_localizations : {}))
              .setRequired(required  || false)
          )
          break
        case 'Subcommand':
          data.addSubcommand(subcommand =>
            subcommand
              .setName(name)
              .setNameLocalizations((name_localizations? name_localizations : {}))
              .setDescription(description)
              .setDescriptionLocalizations((description_localizations? description_localizations : {}))
          )
          break
        case 'SubcommandGroup':
          data.addSubcommandGroup(subcommandGroup =>
            subcommandGroup
              .setName(name)
              .setNameLocalizations((name_localizations? name_localizations : {}))
              .setDescription(description)
              .setDescriptionLocalizations((description_localizations? description_localizations : {}))
          )
          break
      }
    })
  }
}

interface IGuildCommands {
  [guild: string]: SlashCommandBuilder[]
}

interface Options {
  client: Client,
  token: string,
  appId: string,
  owner: string,
  commandsDir: string[],
}