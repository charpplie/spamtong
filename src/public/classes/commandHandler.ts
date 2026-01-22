import { APIApplicationCommandOptionChoice, Client, Collection, CommandInteraction, Interaction, REST, Routes, SlashCommandBuilder } from 'discord.js'
import { OptionAllowedChannelTypes, Command } from '../structures/command'
import { IDiscordConfig } from '../structures/config'
import { BotManager } from './botManager'
import { Utils } from 'comx'
// import { Bot } from 'grammy'

const COOLDOWN_MULTIPLIERS: Record<string, number> = {
  'Seconds': 1000,
  'Minutes': 60000,
  'Hours': 3600000,
  'Days': 86400000,
  'Weeks': 604800000,
}

interface IGuildCommands {
  [guild: string]: SlashCommandBuilder[]
}

export class CommandHandler {
  private instance: BotManager
  private client: Client
  private config: IDiscordConfig
  private commands: Collection<string, Command> = new Collection<string, Command>()
  private cooldowns: Collection<string, number> = new Collection<string, number>()
  private slashCommandsGlobal: SlashCommandBuilder[] = []
  private slashCommandsGuilds: SlashCommandBuilder[] = []

  public constructor(instance: BotManager, client: Client, config: IDiscordConfig) {
    this.instance = instance
    this.client = client
    this.config = config

    this.client.once('clientReady', async () => {
      this.readSlashCommands(config.commandsDir).then(() => this.registerSlashCommands())
    })
  }

  private async readSlashCommands(commandsDir: string) {
    const commands = await Utils.readObjects<Command>(commandsDir)

    for (const command of commands) {
      if ((command.dev && !this.instance.isDev) || (!command.dev && this.instance.isDev)) continue

      if (command.name) this.commands.set(command.name, command)

      const data = new SlashCommandBuilder().setName(command.name).setDescription(command.description)
      this.assignCommandInfo(command, data)

      if (command.guilds) this.slashCommandsGuilds.push(data)
      else this.slashCommandsGlobal.push(data)
    }
  }

  private async registerSlashCommands() {
    const rest = new REST({ version: '10' }).setToken(this.config.token)

    if (this.slashCommandsGlobal.length > 0) {
      try {
        await rest.put(Routes.applicationCommands(`${this.config.appId}`), { body: this.slashCommandsGlobal })
      } catch (why) {
        console.error(why)
      }
    }

    if (this.slashCommandsGuilds.length > 0) {
      const guildCommands: IGuildCommands = {}

      for (const slashCmd of this.slashCommandsGuilds) {
        const command = this.commands.get(slashCmd.name)
        if (command?.guilds) {
          for (const guild of command.guilds) {
            (guildCommands[guild] ??= []).push(slashCmd)
          }
        }
      }

      try {
        await Promise.all(
          Object.entries(guildCommands).map(([guild, commands]) =>
            rest.put(Routes.applicationGuildCommands(`${this.config.appId}`, guild), { body: commands })
          )
        )
      } catch (why) {
        console.error(why)
      }
    }

    this.client.on('interactionCreate', async (interaction: Interaction) => {
      if (interaction.isCommand()) {
        const command = this.commands.get(interaction.commandName)
        if (!command) return

        if (command.isOwnerOnly && interaction.user.id !== this.config.owner) return
        if (command.dev && !this.config.devs.includes(interaction.user.id)) return
        if (command.allowedUsers && !command.allowedUsers.includes(interaction.user.id)) return

        if (await this.checkcooldowns(command, interaction)) command.callback(interaction as CommandInteraction, this.instance)
      } else if (interaction.isAutocomplete()) {
        const command = this.commands.get(interaction.commandName)
        if (!command || !command.autocomplete) return

        try { command.autocomplete(interaction) } catch (why) { }
      }
    })
  }

  private async checkcooldowns(command: Command, interaction: CommandInteraction): Promise<boolean> {
    if (!command.cooldown) return true

    if (command.cooldown.ownerBypass && interaction.user.id === this.config.owner) return true

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
    }

    const cooldownAmount = amount * (COOLDOWN_MULTIPLIERS[multiplier] ?? 1000)
    timestamps.set(cooldownKey, [now, now + cooldownAmount])
    setTimeout(() => timestamps.delete(cooldownKey), cooldownAmount)

    return true
  }

  private assignCommandInfo(command: Command, data: SlashCommandBuilder) {
    if (command.name_localizations) data.setNameLocalizations(command.name_localizations)

    if (command.description_localizations) data.setDescriptionLocalizations(command.description_localizations)

    if (command.options) this.assingCommandOptions(command, data)

    if (command.default_member_permissions) data.setDefaultMemberPermissions(command.default_member_permissions)

    if (command.dm_permission) data.setDMPermission(command.dm_permission)

    if (command.nsfw) data.setNSFW(command.nsfw)
  }

  private setBaseFields(opt: any, o: any) {
    opt.setName(o.name)
      .setNameLocalizations(o.name_localizations ?? {})
      .setDescription(o.description)
      .setDescriptionLocalizations(o.description_localizations ?? {})
      .setRequired(o.required ?? false)
    return opt
  }

  private assingCommandOptions(command: Command, data: SlashCommandBuilder) {
    if (!command.options) return

    for (const o of command.options) {
      switch (o.type) {
        case 'String':
          data.addStringOption(opt => {
            this.setBaseFields(opt, o).setAutocomplete(o.autocomplete ?? false)
            if (o.choices) opt.addChoices(...(o.choices as APIApplicationCommandOptionChoice<string>[]))
            if (o.minLength !== undefined) opt.setMinLength(o.minLength)
            if (o.maxLength !== undefined) opt.setMaxLength(o.maxLength)
            return opt
          })
          break
        case 'Integer':
          data.addIntegerOption(opt => {
            this.setBaseFields(opt, o).setAutocomplete(o.autocomplete ?? false)
            if (o.choices) opt.addChoices(...(o.choices as APIApplicationCommandOptionChoice<number>[]))
            if (o.minValue !== undefined) opt.setMinValue(o.minValue)
            if (o.maxValue !== undefined) opt.setMaxValue(o.maxValue)
            return opt
          })
          break
        case 'Number':
          data.addNumberOption(opt => {
            this.setBaseFields(opt, o).setAutocomplete(o.autocomplete ?? false)
            if (o.choices) opt.addChoices(...(o.choices as APIApplicationCommandOptionChoice<number>[]))
            if (o.minValue !== undefined) opt.setMinValue(o.minValue)
            if (o.maxValue !== undefined) opt.setMaxValue(o.maxValue)
            return opt
          })
          break
        case 'Boolean':
          data.addBooleanOption(opt => this.setBaseFields(opt, o))
          break
        case 'User':
          data.addUserOption(opt => this.setBaseFields(opt, o))
          break
        case 'Channel':
          data.addChannelOption(opt => {
            this.setBaseFields(opt, o)
            if (o.channelTypes) opt.addChannelTypes(...o.channelTypes.map(t => OptionAllowedChannelTypes[t]))
            return opt
          })
          break
        case 'Role':
          data.addRoleOption(opt => this.setBaseFields(opt, o))
          break
        case 'Mentionable':
          data.addMentionableOption(opt => this.setBaseFields(opt, o))
          break
        case 'Attachment':
          data.addAttachmentOption(opt => this.setBaseFields(opt, o))
          break
        case 'Subcommand':
          data.addSubcommand(sub => sub
            .setName(o.name)
            .setNameLocalizations(o.name_localizations ?? {})
            .setDescription(o.description)
            .setDescriptionLocalizations(o.description_localizations ?? {})
          )
          break
        case 'SubcommandGroup':
          data.addSubcommandGroup(grp => grp
            .setName(o.name)
            .setNameLocalizations(o.name_localizations ?? {})
            .setDescription(o.description)
            .setDescriptionLocalizations(o.description_localizations ?? {})
          )
          break
      }
    }
  }
}

// interface Options {
//   instance: BotManager,
//   client: Client,
//   token: string,
//   appId: string,
//   commandsDir: string,
//   owner: string
//   isDev: boolean
//   devs: string | string[]
// }

// export class CommandHandlerTg {
//   private instance: BotManager
//   private client: Bot
//   private commands: Collection<string, CommandTg> = new Collection<string, CommandTg>()
//   private commandsArray: BotCommand[] = []

//   public constructor(options: OptionsTg) {
//     const {
//       instance,
//       client,
//       commandsDir,
//     } = options

//     this.instance = instance
//     this.client = client
//     this.readCommands(commandsDir).then(() => this.registerCommands())
//   }

//   private async readCommands(commandsDir: string[]) {
//     for (const commandDir of commandsDir) {
//       const commands = await Utils.readObjects<CommandTg>(commandDir)

//       for (const command of commands) {
//         if ((command.dev && !this.instance.config.isDev) || (!command.dev && this.instance.config.isDev)) continue

//         if (command.name) {
//           this.commands.set(command.name, command)

//           this.commandsArray.push({
//             command: command.name,
//             description: command.description,
//           })
//         }
//       }
//     }
//   }

//   private async registerCommands() {
//     await this.client.api.setMyCommands(this.commandsArray)

//     for (const command of this.commandsArray) {
//       this.client.use(command.command, async (ctx) => {
//         const cmd = this.commands.get(command.command)
//         if (!cmd) return

//         cmd.callback(this.instance, ctx)
//       })
//     }
//   }
// }

// interface OptionsTg {
//   instance: BotManager,
//   client: Bot,
//   commandsDir: string,
// }