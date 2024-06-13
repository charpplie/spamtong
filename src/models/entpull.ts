import { defSequelize } from './!sequelize'
import { DataTypes } from 'sequelize'

const sequelize = defSequelize('entpull')

export const EntPullModel = sequelize.define('entpullEntPullModel', {
  category: DataTypes.STRING,
  name: DataTypes.STRING,
  links: DataTypes.STRING,
  creatorId: DataTypes.STRING,
})

export default async () => {
  EntPullModel.sync()
}