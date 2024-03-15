import { defSequelize } from './!sequelize'
import { DataTypes } from 'sequelize'
import { Event } from 'jukai'

const sequelize = defSequelize('icont')

export const IContModel = sequelize.define('model', {
  photo_id: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true
  },
  msg_id: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true
  },
  users: DataTypes.TEXT,
  user_rates: DataTypes.JSON,
  rates: {
    type: DataTypes.NUMBER,
    allowNull: true
  },
})

export default {
  name: 'ready',
  callback: async () => {
    IContModel.sync()
  }
} as Event