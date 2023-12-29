import { Event } from 'comx'
import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize('spambase', 'spamtong', 'spamword', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: '../../../../db/temoji.sqlite',
})

export const ITEmojiModel = sequelize.define('model', {
  emoji: DataTypes.STRING,
  daily_usage: DataTypes.NUMBER,
  weekly_usage: DataTypes.NUMBER,
  monthly_usage: DataTypes.NUMBER,
})

const GUILD = '1150427580734906368'

export default {
  name: 'ready',
  once: true,
  callback: async (client) => {
    ITEmojiModel.sync().then(async () => {
      const guild = client.guilds.cache.get(GUILD)
      const emojis = guild.emojis.cache.map((e: any) => { return `${e}` })
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
  },
} as Event