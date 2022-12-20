import { Client, Intents } from 'discord.js'

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
})

client.once('ready', async () => {
    let handler = require('./cmdx.ts')
    if (handler.default) handler = handler.default
    await handler(client)
})

client.login('OTEyMzI2ODI4NTc0NzczMjk5.GYMM8f.UsTu1cZW4-_ZUfBkOyvYiVWh4GuwIPlUJM5L_U')