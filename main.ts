import { Client, Intents } from 'discord.js'

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
    partials: [
        'CHANNEL',
    ]
})

client.once('ready', async () => {
    let handler = require('./cmdx.ts')
    if (handler.default) handler = handler.default
    await handler(client)
})

client.login('OTEyMzI2ODI4NTc0NzczMjk5.GYMM8f.UsTu1cZW4-_ZUfBkOyvYiVWh4GuwIPlUJM5L_U')