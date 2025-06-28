import { Event, Events, Utils } from 'comx'
import { TextChannel, ModalBuilder, ActionRowBuilder, ModalActionRowComponentBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import axios from 'axios'
import { createHash } from 'crypto'

const GUILD = '1335656368241119352'
const CHANNEL = '1340374435294740560'

const BaseUrl = 'https://public.api.bsky.app'

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance) => {
        const guild = instance.client.guilds.cache.get(GUILD)!
        const channel = guild.channels.cache.get(CHANNEL) as TextChannel

        // const r = await axios(`${BaseUrl}/xrpc/app.bsky.actor.getProfiles`, {
        //     params: {
        //         actors: ['tobyfox.undertale.com', 'gabefollower.com']
        //     }
        // })
        // console.log(r.data.profiles)

        const r = await axios.get(`${BaseUrl}/xrpc/app.bsky.feed.getAuthorFeed`, {
            params: {
                actor: 'tobyfox.undertale.com'
            }
        })

        for (const post of r.data.feed) {
            // console.log(post)
            console.log(post.post.record.text)
        }
        // console.log(r.data.feed[3])

        // const modal = new ModalBuilder()
        //     .setCustomId('testModal')
        //     .setTitle('bebranuh')

        //     const sansKto = new TextInputBuilder()
        //         .setCustomId('sansKto')
        //         .setLabel('Sans ktuuuuuuu')
        //         .setStyle(TextInputStyle.Short)

        // const firstRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(sansKto)

        // modal.addComponents(firstRow)

        // const r = await axios.get('https://www.dota2.com/datafeed/abilitylist?language=english')
        // const abilities = r.data.result.data.itemabilities

        // console.log(createHash('sha256', ))

        // for (const ability of abilities) {
        //     const abi = await axios.get(`https://www.dota2.com/datafeed/abilitydata?language=english&ability_id=${ability.id}`)

        //     // console.log(abi.data.result.data)


        //     console.log(Utils.hashCode(JSON.stringify(abi.data.result.data.abilities[0].name)))

        //     await Utils.Sleep(50)
        // }

    }
} as Event