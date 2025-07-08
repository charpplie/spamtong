import { CommandTg } from 'comx'

export default {
    name: 'test',
    description: 'test',
    dev: true,
    callback: async (instance, ctx) => {
        console.log('bebra')
    }
} as CommandTg