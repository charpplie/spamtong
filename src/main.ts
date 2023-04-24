import 'dotenv/config'

import { SlashCommandBuilder, CommandInteraction, Client, Collection, GatewayIntentBits, Events } from 'discord.js'
import { ppSlashCommandHandler } from './cmdx'

export interface SlashCommand {
  command: SlashCommandBuilder | any
  execute: (interaction: CommandInteraction) => void
}

export class CustomClient extends Client { public slashCommands!: Readonly<Collection<string, SlashCommand>> }

const client = new CustomClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  shards: 'auto',
})

client.slashCommands = new Collection<string, SlashCommand>()

client.once(Events.ClientReady, async () => {
  await ppSlashCommandHandler(client)
})

client.login(process.env.token)
