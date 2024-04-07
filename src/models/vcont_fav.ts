import { defSequelize } from './!sequelize'
import { DataTypes } from 'sequelize'

const sequelize = defSequelize('vcont_fav')

export const VCUser = sequelize.define('vcuser', {
  guild: DataTypes.STRING,
  user: DataTypes.STRING,
  guildId: DataTypes.STRING,
  dmId: DataTypes.STRING,
}, { timestamps: false })

export default async () => {
  VCUser.sync()
}