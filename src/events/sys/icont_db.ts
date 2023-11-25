import { Event, Events } from '../../comx'
import { Sequelize, DataTypes, Dialect } from 'sequelize'

const sequelize = new Sequelize(`${process.env.db_database}`, `${process.env.db_username}`, `${process.env.db_password}`, {
  host: `${process.env.db_host}`,
  dialect: `${process.env.db_dialect as Dialect}`,
  logging: false,
  storage: `${process.env.icont_dbpath}`,
})

export const IContModel = sequelize.define('model', {
  [`${process.env.icont_photoid}`]: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true
  },
  [`${process.env.icont_msgid}`]: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true
  },
  [`${process.env.icont_users}`]: DataTypes.TEXT,
  [`${process.env.icont_userrates}`]: DataTypes.JSON,
  [`${process.env.icont_rates}`]: {
    type: DataTypes.NUMBER,
    allowNull: true
  }
})

export default {
  name: Events.ClientReady,
  callback: async () => {
    IContModel.sync()
  },
  once: true
} as Event