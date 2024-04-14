import { defSequelize } from '../!sequelize'
import { DataTypes } from 'sequelize'

const sequelize = defSequelize('guilds/randreacts')

export const RReactsModel = sequelize.define('randreacts', {
  guildId: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  init: {
    type: DataTypes.NUMBER,
    defaultValue: 7,
  },
  inc: {
    type: DataTypes.NUMBER,
    defaultValue: 1.15,
  },
  emoji_list: {
    type: DataTypes.STRING,
  },
  include: {
    type: DataTypes.STRING,
  },
  exclude: {
    type: DataTypes.STRING,
  },
}, { timestamps: false })

export let RRChanged = false

export function setRRChanged(value: boolean) {
  RRChanged = value
}

export default async () => {
  RReactsModel.sync()
}