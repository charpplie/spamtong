import { defSequelize } from '../../!sequelize'
import { DataTypes } from 'sequelize'

const sequelize = defSequelize('icont_ids')

export const ICPhotoIDs = sequelize.define('icphotoids', {
  guildId:DataTypes.STRING,
  userId: DataTypes.STRING,
  lastId: DataTypes.NUMBER,
}, { timestamps: false })

export default async () => {
  ICPhotoIDs.sync()
}