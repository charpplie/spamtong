import { Event, Events } from 'comx'
import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize('spambase', 'spamtong', 'spamword', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'db/guilds.sqlite',
})

export const IGuildsModel = sequelize.define('model', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
})

export default {
  name: Events.ClientReady,
  callback: async (client) => {
    const guilds = client.guilds.cache.map((guild: { id: any }) => guild.id)
  }
} as Event