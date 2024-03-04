import { defSequelize } from './!sequelize'
import { DataTypes } from 'sequelize'

const sequelize = defSequelize('emoji_trends')

export const ITEmojiModel = sequelize.define('model', {
  emoji: DataTypes.STRING,
  daily_usage: DataTypes.NUMBER,
  weekly_usage: DataTypes.NUMBER,
  monthly_usage: DataTypes.NUMBER,
})

const GUILD = '1150427580734906368'

export default async (client: any) => {
  ITEmojiModel.sync().then(async () => {
    const guild = client.guilds.cache.get(GUILD)
    if (!guild) return

    const emojis = guild.emojis.cache.map((e: any) => { return `${e.animated? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>` }` })
    for (let i = 0; i < emojis.length; i++) {
      if (!(await ITEmojiModel.findOne({ where: { emoji: emojis[i] }}))) {
        await ITEmojiModel.create({
          emoji: emojis[i],
          daily_usage: 0,
          weekly_usage: 0,
          monthly_usage: 0,
        })
      }
    }
  })
}