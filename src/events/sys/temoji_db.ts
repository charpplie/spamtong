import { Event, Events } from '../../comx'
import { Sequelize, DataTypes, Dialect } from 'sequelize'

const sequelize = new Sequelize(`${process.env.db_database}`, `${process.env.db_username}`, `${process.env.db_password}`, {
  host: `${process.env.db_host}`,
  dialect: `${process.env.db_dialect as Dialect}`,
  logging: false,
  storage: `${process.env.temoji_dbpath}`
})

export const ITEmojiModel = sequelize.define('model', {
  [`${process.env.temoji_emoji}`]: DataTypes.STRING,
  [`${process.env.temoji_daily}`]: DataTypes.NUMBER,
  [`${process.env.temoji_weekly}`]: DataTypes.NUMBER,
  [`${process.env.temoji_monthly}`]: DataTypes.NUMBER
})

export default {
  name: Events.ClientReady,
  callback: async (client) => {
    ITEmojiModel.sync().then(async () => {
      const guild = client.guilds.cache.get(`${process.env.temoji_guild}`)
      const emojis = guild.emojis.cache.map((e: any) => { return `${e}` })
      for (let i = 0; i < emojis.length; i++) {
        if (!(await ITEmojiModel.findOne({ where: { emoji: emojis[i] }}))) {
          await ITEmojiModel.create({
            [`${process.env.temoji_emoji}`]: emojis[i],
            [`${process.env.temoji_daily}`]: 0,
            [`${process.env.temoji_weekly}`]: 0,
            [`${process.env.temoji_monthly}`]: 0,
          })
        }
      }
    })
  },
  once: true
} as Event