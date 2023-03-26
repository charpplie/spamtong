import path from 'path'
import { promises as fs } from 'fs'
import type { Client, Message } from 'discord.js'

async function getCommandFilePaths(dirPath: string): Promise<string[]> {
  try {
    const dirEntries = await fs.readdir(dirPath, { withFileTypes: true })
    const filePaths = await Promise.all(
      dirEntries.map(async (dirEntry) => {
        const resPath = path.resolve(dirPath, dirEntry.name)
        return dirEntry.isDirectory()
          ? getCommandFilePaths(resPath)
          : resPath
      })
    )
    return filePaths.flat()
  } catch (error) {
    console.error(`Error getting command file paths: ${error}`)
    return []
  }
}

export default async function setupCommands(client: Client) {
  const commandsByName: Record<string, any> = {}

  const commandFilePaths = await getCommandFilePaths('./commands')

  for (const filePath of commandFilePaths) {
    try {
      const { default: command } = await import(filePath)
      const commandName = path.basename(filePath, path.extname(filePath)).toLowerCase()
      commandsByName[commandName] = command
    } catch (error) {
      console.error(`Error importing command from file ${filePath}: ${error}`)
    }
  }

  client.on('messageCreate', async (message: Message) => {
    if (message.author.bot || !message.content.startsWith('!')) return

    const [commandName, ...args] = message.content.slice(1).split(/ +/)

    const command = commandsByName[commandName.toLowerCase()]
    if (!command) return

    try {
      await command.callback(message, ...args)
    } catch (error) {
      console.error(`Error executing command ${commandName}: ${error}`)
    }
  })
}
