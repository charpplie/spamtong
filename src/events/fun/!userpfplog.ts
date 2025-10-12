import { Event, Events, Utils } from 'comx'
import { TextChannel, User, EmbedBuilder } from 'discord.js'
import axios from 'axios'
import { createWriteStream } from 'fs'
import { exec } from 'child_process'

const GUILD = '1150427580734906368'
const CHANNEL = '1204439974766706698'

const BASE_URL = 'https://raw.githubusercontent.com/testcappepe/dota_images/refs/heads/main/img/'

async function download_img(url: string, filePath: string) {
    const r = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    })

    return new Promise((resolve, reject) => {
        r.data
            .pipe(createWriteStream(filePath))
            .on('error', reject)
            .once('close', () => resolve(filePath))
    })
}

export default {
    name: Events.UserUpdate,
    // dev: true,
    callback: async (instance, oldUser: User, newUser: User) => {
        try {
            if (oldUser.bot) return

            const guild = instance.client.guilds.cache.get(GUILD)!

            if (!guild.members.cache.get(oldUser.id)) return

            const channel = guild.channels.cache.get(CHANNEL) as TextChannel

            if (newUser.avatar === null) {
                const embed = new EmbedBuilder()
                    .setColor('DarkPurple')
                    .setFooter({ text: Utils.locale('g.copyright', 'en'), iconURL: instance.getOwnerIcon() })
                    .setTitle(`${oldUser.username} убрал аватарку`)

                await channel.send({
                    embeds: [embed]
                })
                return
            }

            if (oldUser.avatar !== newUser.avatar) {
                const filePath = `../dota_images/img/${newUser.avatar}.webp`
                const url = newUser.avatarURL()!

                await download_img(url, filePath).then(async () => {
                    exec('cd ../dota_images && git add . && git commit -m "img upload"', (err, stdout, stderr) => {
                        if (err) {
                            console.error(err)
                            return
                        }

                        console.log(stdout)
                        console.log(stderr)

                        exec('cd ../dota_images && git push', async (err, stdout, stderr) => {
                            if (err) {
                                console.error(err)
                                return
                            }

                            console.log(stdout)
                            console.log(stderr)

                            const embed = new EmbedBuilder()
                                .setColor('DarkPurple')
                                .setImage(`${BASE_URL}${newUser.avatar}.webp`)
                                .setFooter({ text: Utils.locale('g.copyright', 'en'), iconURL: instance.getOwnerIcon() })
                                .setTitle(`${oldUser.username} поменял аватарку`)
                                .setDescription(`${oldUser.avatar === null ? '' : `[Old](${BASE_URL}${oldUser.avatar}.webp) |`} [New](${BASE_URL}${newUser.avatar}.webp)`)

                            await channel.send({
                                embeds: [embed]
                            })
                        })
                    })
                })
            }
        } catch (why) {
            console.error(why)
        }

        // const url = newUser.avatarURL({ forceStatic: true })!
        // const url = 'https://cdn.discordapp.com/avatars/1350181921946075229/1196620a2d91337c083de8f35102b48b.webp'
        // await download_img(url, './img/1196620a2d91337c083de8f35102b48b.webp')
        // const r = await axios.get(url, { responseType: 'stream' })
        // const bufferData = Buffer.from(r.data, )
        // const filePath = `./img/${newUser.avatar}`
        // await fs.writeFile(filePath, bufferData)

        // const avatarUrl = newUser.avatar
        // console.log(newUser.avatar)
    }
} as Event