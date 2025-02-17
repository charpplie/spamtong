import { defSequelize } from './!sequelize'
import { DataTypes } from 'sequelize'

const sequelize = defSequelize('wls_voice_rooms')

export const VoiceRooms = sequelize.define('voiceRoomsModel', {
  userId: DataTypes.STRING,
  rooms: DataTypes.JSON
})

export default async () => {
  VoiceRooms.sync()
}