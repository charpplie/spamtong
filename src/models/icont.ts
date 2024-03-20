import { defSequelize } from './!sequelize'
import { DataTypes } from 'sequelize'

const sequelize = defSequelize('icont')

export const IContModel = sequelize.define('model', {
  messageId: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true,
  },
  photoId: DataTypes.STRING,
  users: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
})

export default async () => {
  IContModel.sync()
}