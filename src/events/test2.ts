import { Event, Events, Utils } from 'comx'
import axios, { AxiosResponse } from 'axios'
import { createHash } from 'crypto'

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance) => {
        // const r = '{"result":{"data":{"abilities":[{"id":5676,"name":"courier_take_stash_and_transfer_items","name_loc":"","desc_loc":"","lore_loc":"","notes_loc":[],"shard_loc":"","scepter_loc":"","type":0,"behavior":"134217733","target_team":0,"target_type":0,"flags":0,"damage":0,"immunity":0,"dispellable":0,"max_level":1,"cast_ranges":[0],"cast_points":[0],"channel_times":[0],"cooldowns":[0],"durations":[0],"damages":[0,0,0,0],"mana_costs":[0],"gold_costs":[],"health_costs":[],"special_values":[{"name":"handoff_distance","values_float":[400],"is_percentage":false,"heading_loc":"","bonuses":[],"values_shard":[],"values_scepter":[]},{"name":"AbilityCastRange","values_float":[0],"is_percentage":false,"heading_loc":"","bonuses":[],"values_shard":[],"values_scepter":[]},{"name":"AbilityChannelTime","values_float":[0],"is_percentage":false,"heading_loc":"","bonuses":[],"values_shard":[],"values_scepter":[]},{"name":"AbilityDuration","values_float":[0],"is_percentage":false,"heading_loc":"","bonuses":[],"values_shard":[],"values_scepter":[]},{"name":"AbilityCastPoint","values_float":[0],"is_percentage":false,"heading_loc":"","bonuses":[],"values_shard":[],"values_scepter":[]},{"name":"AbilityCharges","values_float":[0],"is_percentage":false,"heading_loc":"","bonuses":[],"values_shard":[],"values_scepter":[]},{"name":"AbilityChargeRestoreTime","values_float":[0],"is_percentage":false,"heading_loc":"","bonuses":[],"values_shard":[],"values_scepter":[]},{"name":"AbilityManaCost","values_float":[0],"is_percentage":false,"heading_loc":"","bonuses":[],"values_shard":[],"values_scepter":[]},{"name":"AbilityCooldown","values_float":[0],"is_percentage":false,"heading_loc":"","bonuses":[],"values_shard":[],"values_scepter":[]}],"is_item":false,"ability_has_scepter":false,"ability_has_shard":false,"ability_is_granted_by_scepter":false,"ability_is_granted_by_shard":false,"item_cost":0,"item_initial_charges":0,"item_neutral_tier":4294967295,"item_stock_max":0,"item_stock_time":0,"item_quality":0}]},"status":1}}'
        // const h = createHash('sha256').update(r).digest('hex')
        // console.log(h.slice(0, 10))
        const r = await axios.get('https://api.steampowered.com/ISteamEconomy/GetAssetClassInfo/v1/?appid=570&key=5C4C78E798EF7440712A6820D9BCE1EA&class_count=1&classid0=466528210')
        const _r = JSON.stringify(r.data.result['466528210'])
        console.log(r.data.result['466528210'].length)
        // const prices = await axios.get('https://api.steampowered.com/ISteamEconomy/GetAssetPrices/v1/?appid=570&key=5C4C78E798EF7440712A6820D9BCE1EA')
        // let r = `https://api.steampowered.com/ISteamEconomy/GetAssetClassInfo/v1/?appid=570&key=5C4C78E798EF7440712A6820D9BCE1EA`
        // let data = []
        // let class_count = 0
        // for (let i = 0; i < prices.data.result.assets.length; i++) {
        //     let _str = `&classid${class_count}=${prices.data.result.assets[i].classid}`
        //     if ((r + _str).length >= 1950 && (r + _str).length <= 2048) {
        //         r += _str + `&class_count=${class_count}`
        //         const _ = await axios.get(r)
        //         data.push(_.data)
        //         r = 'https://api.steampowered.com/ISteamEconomy/GetAssetClassInfo/v1/?appid=570&key=5C4C78E798EF7440712A6820D9BCE1EA'
        //         class_count = 0

        //         await Utils.Sleep(50)
        //     } else {
        //         r += `&classid${class_count}=${prices.data.result.assets[i].classid}`
        //         class_count++
        //     }
        // }

        // for (let i = 0; i < data.length; i++) {
        //     for (const item of Object.entries(data[i].result)) {
        //         // console.log(i)
        //         if (data[i].result[item[0]].name != undefined) {
        //             // console.log(data[i].result[item[0]].name)
        //             if (data[i].result[item[0]].name.includes('Quas')) {
        //                 console.log(data[i].result[item[0]].name)
        //                 console.log(data[i].result[item[0]].classid)
        //             }
        //         }
        //         // console.log(data[i].result[item[0]].name)
        //     }
        // }
        // console.log(data[70].result)
        // let a = 0
        // for (let i = 0; i < data.length; i++) {
        //     for (const item of data[i].result) {
        //         console.log(item.name)
        //         console.log(a++)
        //     }
        //     // console.log(++a)
        // }
        // console.log(data.length)



        // const _r = await axios.get(r)

        // // console.log(_r.data.result['57939548'])

        // for (const item of _r.data.result) {
        //     console.log(item.name)
        // }

        // for (let i = 0; i < _r.data.result.length;)

        // console.log(r)
    }
} as Event