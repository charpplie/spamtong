import { Client, IntentsBitField } from 'discord.js'

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
    ],
})

client.once('ready', async () => {
    let handler = require('./cmdx.ts')
    if (handler.default) handler = handler.default
    await handler(client)
})

client.login('OTEyMzI2ODI4NTc0NzczMjk5.GZ-IY2.GtqmexqMrirArlJc9Mt0xbSj1Z6lZa0de-PBiE')
