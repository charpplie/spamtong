import { defSequelize } from './!sequelize'
import { DataTypes } from 'sequelize'

const sequelize = defSequelize('vcont_fav')

export const IVcontFavModel = sequelize.define('model', {
  user: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true
  },
  guildId: DataTypes.STRING,
  dmId: DataTypes.STRING,
})

export default async () => {
  IVcontFavModel.sync()
}