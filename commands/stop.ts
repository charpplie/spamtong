import { Message } from 'discord.js'
import * as fs from 'fs'
import { exit } from 'process'

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

export default {
    callback: async function f(message: Message, ...args: string[]) {
        if (message.author.id != '783443296382746672') return 0
        
        if (fs.existsSync('dchannel.txt')) {
            const dota_chnm = String(fs.readFileSync('dchannel.txt'))
            const dota_chid = message.guild?.channels.cache.find(c => c.name === dota_chnm)
            message.guild?.channels.delete(String(dota_chid?.id))
        }

        if (fs.existsSync('tmchannel.txt')) {
            const dota_chnm = String(fs.readFileSync('tmchannel.txt'))
            const dota_chid = message.guild?.channels.cache.find(c => c.name === dota_chnm)
            message.guild?.channels.delete(String(dota_chid?.id))
        }

        if (fs.existsSync('stchannel.txt')) {
            const dota_chnm = String(fs.readFileSync('stchannel.txt'))
            const dota_chid = message.guild?.channels.cache.find(c => c.name === dota_chnm)
            message.guild?.channels.delete(String(dota_chid?.id))
        }

        await sleep(5000)

        if (fs.existsSync('dchannel.txt')) fs.unlinkSync('dchannel.txt')
        if (fs.existsSync('tmchannel.txt')) fs.unlinkSync('tmchannel.txt')
        if (fs.existsSync('stchannel.txt')) fs.unlinkSync('stchannel.txt')

        await sleep(500)
        
        exit(0)
    }
}