import { Client, Collection } from 'discord.js'
import SlashCommand from './slashCommand'

export default class CustomClient extends Client {
  public commands!: Readonly<Collection<string, SlashCommand>>
  public cooldowns!: Readonly<Collection<string, number>>
}