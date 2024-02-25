import { Event } from 'comx'
import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize('spambase', 'spamtong', 'spamword', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'db/icont.sqlite',
})

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
  },
} as Event