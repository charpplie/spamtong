import { Command } from 'comx'
import axios from 'axios'

const url = 'https://discord.com/api/webhooks/1485920206680363121/eQXgb-3i_HRZdJI_WMFtWiFEkUGnvPspMh4J1-lYoxpg9Bxu-4JY5drZHZ9ER_31wwBi'

export default {
    name: 'webhook_test',
    description: 'webhook test 1',
    callback: async (interaction, instance) => {
        axios.post(url, {
            'content': 'test'
        })
    },
    dev: true,
    guilds: ['1335656368241119352']
} as Command