import { Event, Events } from 'comx'
import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize('spambase', 'spamtong', 'spamword', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'db/vcont_fav.sqlite',
})

export const IVcontFavModel = sequelize.define('model', {
  user: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true
  },
  guildId: DataTypes.STRING,
  dmId: DataTypes.STRING,
})

export default {
  name: Events.ClientReady,
  callback: async () => {
    IVcontFavModel.sync()
  },
} as Event