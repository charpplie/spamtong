import { Event } from '@/comx'
import { Sequelize, DataTypes } from 'sequelize'

export interface IComData {
  [name: string]: string,
}

const sequelize = new Sequelize('spambase', 'spamtong', 'spamword', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'db/activities.sqlite',
})

export const IComModel = sequelize.define('model', {
  activity: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true,
  },
  data: {
    type: DataTypes.JSON,
  },
})

export default {
  name: 'activities_db',
  type: 'ready',
  once: true,
  callback: async (client) => {
    IComModel.sync().then(async () => {
      for (let i = 0; i < client.commands.size; i++) {
        const commandName = client.commands.at(i)?.name
        if (!(await IComModel.findOne({ where: { activity: commandName }}))) {
          await IComModel.create({
            activity: commandName,
          })
        }
      }

      for (let i = 0; i < client.events.size; i++) {
        const eventName = client.events.at(i)?.name
        if (!(await IComModel.findOne({ where: { activity: eventName }}))) {
          await IComModel.create({
            activity: eventName,
          })
        }
      }

      const activities = await IComModel.findAll()

      for (const activity of activities) {
        const activityName = activity.get('activity') as string
        if (!client.commands.has(activityName) && !client.events.has(activityName)) {
          await activity.destroy()
        }
      }
    })
  },
} as Event