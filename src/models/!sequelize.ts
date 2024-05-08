import { Sequelize } from 'sequelize'

const _pathToSave = process.argv.slice(2).includes('--dev') ? 'db' : '../db'

export function defSequelize(name: string, pathToSave = _pathToSave): Sequelize {
  return new Sequelize('spambase', 'spamtong', 'spamword', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `${pathToSave}/${name}.sqlite`
  })
}