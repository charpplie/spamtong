import { Event, Events } from '@/comx'
import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize('spambase', 'spamtong', 'spamword', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'db/temoji_tdb.sqlite',
})

export const ITimerModel = sequelize.define('model', {
  id: {
    type: DataTypes.NUMBER,
    primaryKey: true,
  },
  lastTriggeredAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  }
})

export default {
  name: Events.ClientReady,
  callback: async () => {
    ITimerModel.sync()
  },
  once: true
} as Event