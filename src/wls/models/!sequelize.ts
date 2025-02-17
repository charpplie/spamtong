import { Sequelize } from 'sequelize'

const _path = 'db'

export function defSequelize(name: string, path = _path): Sequelize {
  return new Sequelize('wlsbase', 'wlsbase', 'wlsbase', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `${path}/${name}.sqlite`
  })
}