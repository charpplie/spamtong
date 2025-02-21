import { defSequelize } from '../../!sequelize'
import { DataTypes } from 'sequelize'

const sequelize = defSequelize('icont')

export const ICPhoto = sequelize.define('icphoto', {
  messageId: DataTypes.STRING,
  photoId: DataTypes.STRING,
  users: DataTypes.JSON
}, { timestamps: false })

export default async () => {
  ICPhoto.sync()
}