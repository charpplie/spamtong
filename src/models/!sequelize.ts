import { Sequelize } from 'sequelize'
import os from 'os'

const _pathToSave = os.type() === 'Windows_NT' ? 'db' : '../db'

export function defSequelize(name: string, pathToSave = _pathToSave): Sequelize {
  return new Sequelize('spambase', 'spamtong', 'spamword', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `${pathToSave}/${name}.sqlite` 
  }) 
}