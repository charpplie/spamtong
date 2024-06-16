import { Sequelize } from 'sequelize'

const _pathToSave = 'db'

export function defSequelize(name: string, pathToSave = _pathToSave): Sequelize {
  return new Sequelize('spambase', 'spamtong', 'spamword', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `${pathToSave}/${name}.sqlite`
  })
}