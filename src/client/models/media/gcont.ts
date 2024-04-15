import { defSequelize } from '../!sequelize'
import { DataTypes } from 'sequelize'

const sequelize = defSequelize('gcont')

export const GIContModel = sequelize.define('model', {
  guildId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  groupId: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true,
  },
  lastId: DataTypes.STRING,
})

export default async () => {
  GIContModel.sync()
}