import fs, { Dirent } from 'fs'

async function __CGetComFiles(_dir: string) {
    const files: Dirent[] = fs.readdirSync(_dir, {
        withFileTypes: true,
    })

    let src_files: string[] = []

    for (const file of files) {
        if (file.isDirectory()) src_files = [...src_files, ... await __CGetComFiles(`${_dir}/${file.name}`)]
        else if (file.name.endsWith('.ts')) {
            let file_name: string | string[] = file.name.replace(/\\/g, '/').split('/')
            file_name = file_name[file_name.length - 1]
            file_name = file_name.split('.')[0].toLowerCase()

            src_files.push(`${_dir}/${file.name}`)
        }
    }

    return src_files
}

import { Client } from 'discord.js'

export default async (client: Client) => {
    const commands = {} as {
        [key: string]: any,
    }

    const command_files = await __CGetComFiles('./commands')

    for (const command of command_files) {
        let command_file = require(command)
        if (command_file.default) command_file = command_file.default

        const split = command.replace(/\\/g, '/').split('/')
        const command_name = split[split.length - 1].replace('.ts', '')

        commands[command_name.toLowerCase()] = command_file
    }

    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.content.startsWith('!')) return

        const args = message.content.slice(1).split(/ +/)
        const command_name = args.shift()!.toLowerCase()

        if (!commands[command_name]) return

        try {
            await commands[command_name].callback(message, ...args)
        } catch (why) {
            console.error(why)
        }
    })
}