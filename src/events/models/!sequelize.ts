import { Sequelize } from 'sequelize'

export function defSequelize(name: string, pathToSave = 'db'): Sequelize { return new Sequelize('spambase', 'spamtong', 'spamword', { host: 'localhost', dialect: 'sqlite', logging: false, storage: `${pathToSave}/${name}.sqlite`}) }