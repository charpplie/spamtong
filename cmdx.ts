import path from 'path'
import fs from 'fs'
import type { Client, Message } from 'discord.js'
import winston, { createLogger } from 'winston'
import { format } from 'logform'

export interface ICommand {
  name: string | string[]
  allowedUsers?: string | string[]
  allowedServers?: string | string[]
  allowedRoles?: string | string[]
  callback: (message: Message, ...args: string[]) => Promise<void>
}

const logger = createLogger({
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)),
  transports: [new winston.transports.Console()]
})

function getCommandFilePaths(dirPath: string): string[] {
  try {
    const dirEntries = fs.readdirSync(dirPath, { withFileTypes: true })
    const filePaths = dirEntries.map(dirEntry => {
      const resPath = path.resolve(dirPath, dirEntry.name)
      return dirEntry.isDirectory() ? getCommandFilePaths(resPath) : resPath
    })
    return filePaths.flat()
  } catch (error) {
    logger.error(`Error getting command file paths: ${error}`)
    return []
  }
}

function importCommands(commandFilePaths: string[]): Map<string, ICommand> {
  const commands = new Map<string, ICommand>()

  for (const filePath of commandFilePaths) {
    try {
      const { default: command } = require(filePath)
      if (!command.name) {
        logger.warn(`Command name not found in file ${filePath}`)
        continue
      }
      const commandNames = Array.isArray(command.name) ? command.name : [command.name]
      for (const name of commandNames) {
        if (commands.has(name)) {
          logger.warn(`Duplicate command name found in file ${filePath}`)
          continue
        }
        commands.set(name.toLowerCase(), command)
      }
    } catch (error) {
      logger.error(`Error importing command from file ${filePath}: ${error}`)
    }
  }

  return commands
}

export default function setupCommands(client: Client, allowedServers?: string[]) {
  const commandFilePaths = getCommandFilePaths('./commands')
  const commands = importCommands(commandFilePaths)

  client.on('messageCreate', async (message: Message) => {
    if (message.author.bot || !message.content.startsWith('!')) return

    const [commandName, ...args] = message.content.slice(1).split(/ +/)

    const command = commands.get(commandName.toLowerCase())
    if (!command) return

    if (command.allowedServers && !command.allowedServers.includes(message.guildId || '') && !command.allowedServers.includes(args[0])) {
      message.reply('This command can only be used in specific servers.')
      return
    }

    if (command.allowedRoles && !message.member?.roles.cache.find(r => r.id.includes(String(command.allowedRoles)))) {
      message.reply('This command can only be used by specific roles.')
      return
    }

    if (command.allowedUsers && !command.allowedUsers.includes(message.author.id)) {
      message.reply('You are not allowed to use this command.')
      return
    }

    try {
      await command.callback(message, ...args)
    } catch (error) {
      logger.error(`Error executing command ${commandName}: ${error}`)
    }
  })
}
