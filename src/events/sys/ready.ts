import { Event } from '@/comx'
import { Logger } from 'logger'
import { Sleep } from '@/utils'

const games = [
  'Half-Life',
  'Team Fortress Classic',
  'Ricochet',
  'Counter-Strike',
  'Deathmatch Classic',
  'Day of Defeat',
  'Counter-Strike: Condition Zero',
  'Half-Life 2',
  'Half-Life 2: Deathmatch',
  'Half-Life 2: Lost Coast',
  'Half-Life: Episode One',
  'Team Fortress 2',
  'Portal',
  'Half-Life 2: Episode Two',
  'Left 4 Dead',
  'Left 4 Dead 2',
  'Alien Swarm',
  'Portal 2',
  'Counter-Strike: Global Offensive',
  'Dota 2',
  'The Lab',
  'Artifact',
  'Dota Underlords',
  'Half-Life: Alyx',
  'Counter-Strike 2'
]

export default {
  name: 'ready',
  once: true,
  callback: async (client) => {
    Logger.info('Ok!')
    while (true) {
      const gameId = Math.floor(Math.random() * games.length)
      client.user.setActivity(games[gameId], { type: 0 })
      await Sleep(2500)
    }
  }
} as Event