import { defSequelize } from './!sequelize'
import { DataTypes } from 'sequelize'
import { Event } from 'jukai'

const sequelize = defSequelize('vcont')

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
  name: 'ready',
  callback: async () => {
    IVcontFavModel.sync()
  }
} as Event