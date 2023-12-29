// import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction } from 'discord.js'
// import { writeFileSync, readFileSync, unlinkSync, createWriteStream, existsSync, mkdirSync, write } from 'fs'
// import { gql, GraphQLClient } from 'graphql-request'
// import { createCanvas, loadImage } from 'canvas'
// import { SlashCommand } from 'comx'
// import { join } from 'path'
// import axios from 'axios'
// import { Logger } from 'logger'

// // function formatTime(seconds: number): string {
// //   const minutes: number = Math.floor(seconds / 60)
// //   const remainingSeconds: number = seconds % 60

// //   const formattedMinutes: string = minutes < 10 ? `0${minutes}` : `${minutes}`
// //   const formattedSeconds: string = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`

// //   return `${formattedMinutes}:${formattedSeconds}`
// // }

// // function indexOfMinNegativeValue(array: any[]): number {
// //   let maxNegativeIndex: number = 0
// //   let maxNegativeValue: number = 0

// //   for (let i = 0; i < array.length; i++) {
// //     const element = array[i].time
// //     if (element < 0 && (maxNegativeValue === 0 || element > maxNegativeValue)) {
// //       maxNegativeValue = element
// //       maxNegativeIndex = i
// //     }
// //   }

// //   return maxNegativeIndex
// // }

// // function generateRandomText(length: number): string {
// //   const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
// //   let randomText = ''

// //   for (let i = 0; i < length; i++) {
// //     const randomIndex = Math.floor(Math.random() * characters.length)
// //     randomText += characters.charAt(randomIndex)
// //   }

// //   return randomText
// // }

// // async function uploadToImgur(accessToken: string, filename: string) {
// //   try {
// //     const response = await axios.post(
// //       'https://api.imgur.com/3/image',
// //       {
// //         image: readFileSync(filename, 'base64'),
// //         type: 'base64',
// //       },
// //       {
// //         headers: {
// //           Authorization: `Client-ID ${accessToken}`,
// //         },
// //       }
// //     )
// //     return response.data.data.link
// //   } catch (error) {
// //     Logger.error(`Error uploading to Imgur: ${error}`)
// //     throw error
// //   }
// // }
// // //#endregion Utils

// // //#region Graphic functions
// // async function drawOnImage(imagePath: string, text: string, outputPath: string) {
// //   const image = await loadImage(imagePath)
// //   const canvas = createCanvas(image.width, image.height)
// //   const ctx = canvas.getContext('2d')

// //   ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

// //   ctx.font = '24px Arial'
// //   ctx.fillStyle = 'white'
// //   ctx.fillText(text, canvas.width - 25, canvas.height - 5)

// //   const buffer = canvas.toBuffer('image/png')
// //   writeFileSync(outputPath, buffer)
// // }

// // async function generateItemBuildEarlyGameImage(main: string, header: string, regen: string, regen_items: IDotaItemCons, items: IDotaItem, items10text: string, items10: IDotaItem, networth10: string, runestext: string, runes: IDotaItemCons, outputPath: string) {
// //   let paths = []
// //   let con_paths = []
// //   let items10_paths = []
// //   let runes_paths = []
// //   if (Object.entries(items).length - 1 > 0) {
// //     for (const id in items) {
// //       if (items.hasOwnProperty(id) && id !== 'time') {
// //         const value: any = items[id]
// //         if (value !== null) {
// //           const image = DOTA_ITEM_IMAGE + `${ITEM_NAMES[value.itemId].replace(/item_/gi, '')}.png`

// //           const filePath = join(__dirname, `image/${id}${generateRandomText(12)}.png`)
// //           const writer = createWriteStream(filePath)

// //           const response = await axios({
// //             url: image,
// //             method: 'GET',
// //             responseType: 'stream',
// //           })

// //           response.data.pipe(writer)

// //           await new Promise((resolve, reject) => {
// //             writer.on('finish', resolve)
// //             writer.on('error', reject)
// //           })

// //           paths.push(filePath)

// //           if (value.charges > 0) {
// //             if (value.itemId === 44) {
// //               const charge = value.charges / 3
// //               if (charge > 1) {
// //                 await drawOnImage(filePath, `x${charge}`, filePath)
// //               }
// //             } else {
// //               if (value.charges > 1) {
// //                 await drawOnImage(filePath, `x${value.charges}`, filePath)
// //               }
// //             }
// //           }
// //         }
// //       }
// //     }
// //   }

// //   if (Object.entries(regen_items).length > 0) {
// //     for (const id in regen_items) {
// //       if (regen_items.hasOwnProperty(id) && regen_items[id] !== 0) {
// //         const value: any = regen_items[id]
// //         if (value !== null && ITEMS[id]) {
// //           const image = DOTA_ITEM_IMAGE + `${ITEM_NAMES[id].replace(/item_/gi, '')}.png`

// //           const filePath = join(__dirname, `image/${id}${generateRandomText(12)}.png`)
// //           const writer = createWriteStream(filePath)

// //           const response = await axios({
// //             url: image,
// //             method: 'GET',
// //             responseType: 'stream',
// //           })

// //           response.data.pipe(writer)

// //           await new Promise((resolve, reject) => {
// //             writer.on('finish', resolve)
// //             writer.on('error', reject)
// //           })

// //           con_paths.push(filePath)

// //           await drawOnImage(filePath, `x${regen_items[id]}`, filePath)
// //         }
// //       }
// //     }
// //   }

// //   if (Object.entries(items10).length - 1 > 0) {
// //     for (const id in items10) {
// //       if (items10.hasOwnProperty(id) && id !== 'time') {
// //         const value: any = items10[id]
// //         if (value !== null) {
// //           const image = DOTA_ITEM_IMAGE + `${value.replace(/item_/gi, '')}.png`

// //           const filePath = join(__dirname, `image/${id}${generateRandomText(12)}.png`)
// //           const writer = createWriteStream(filePath)

// //           const response = await axios({
// //             url: image,
// //             method: 'GET',
// //             responseType: 'stream',
// //           })

// //           response.data.pipe(writer)

// //           await new Promise((resolve, reject) => {
// //             writer.on('finish', resolve)
// //             writer.on('error', reject)
// //           })

// //           items10_paths.push(filePath)
// //         }
// //       }
// //     }
// //   }

// //   if (Object.entries(runes).length - 1 > 0) {
// //     let i = 0
// //     for (const id in runes) {
// //       if (runes.hasOwnProperty(id)) {
// //         const value: any = runes[id]
// //         if (value !== null) {
// //           const rune = Object.keys(runes)[i]
// //           i++
// //           const image = DOTA_RUNE_IMAGE + `${rune}.png`

// //           const filePath = join(__dirname, `image/${id}${generateRandomText(12)}.png`)
// //           const writer = createWriteStream(filePath)

// //           const response = await axios({
// //             url: image,
// //             method: 'GET',
// //             responseType: 'stream',
// //           })

// //           response.data.pipe(writer)

// //           await new Promise((resolve, reject) => {
// //             writer.on('finish', resolve)
// //             writer.on('error', reject)
// //           })

// //           runes_paths.push(filePath)

// //           await drawOnImage(filePath, `x${value}`, filePath)
// //         }
// //       }
// //     }
// //   }

// //   const canvas = createCanvas(800, 600)
// //   const ctx = canvas.getContext('2d')

// //   const background = await loadImage(BG_PATH)
// //   ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

// //   const inv = await loadImage(INV_PATH)
// //   ctx.drawImage(inv, 50, 105, inv.width * 1.115, inv.height * 1.115)
// //   ctx.drawImage(inv, 50, 335, inv.width * 1.115, inv.height * 1.115)

// //   const gold = await loadImage(GOLD_PATH)
// //   ctx.drawImage(gold, 52, 485, gold.width / 2.35, gold.height / 2.35)

// //   const pos: IPos = {
// //     item0: { x: 56, y: 113},
// //     item1: { x: 154, y: 113},
// //     item2: { x: 252, y: 113},
// //     item3: { x: 56, y: 185},
// //     item4: { x: 154, y: 185},
// //     item5: { x: 252, y: 185},
// //   }

// //   for (let i = 0; i < paths.length; i++) {
// //     const item = await loadImage(paths[i])
// //     ctx.drawImage(item, pos[`item${i}`].x, pos[`item${i}`].y, item.width, item.height)
// //   }

// //   const cons_pos: IPos = {
// //     pos0: { x: 400, y: 113},
// //     pos1: { x: 500, y: 113},
// //     pos2: { x: 600, y: 113},
// //     pos3: { x: 700, y: 113},
// //     pos4: { x: 400, y: 185},
// //     pos5: { x: 500, y: 185},
// //     pos6: { x: 600, y: 185},
// //     pos7: { x: 700, y: 185},
// //     pos8: { x: 400, y: 257},
// //     pos9: { x: 500, y: 257},
// //     pos10: { x: 600, y: 257},
// //     pos11: { x: 700, y: 257},
// //   }

// //   for (let i = 0; i < con_paths.length; i++) {
// //     const item = await loadImage(con_paths[i])
// //     ctx.drawImage(item, cons_pos[`pos${i}`].x, cons_pos[`pos${i}`].y, item.width, item.height)
// //   }

// //   const pos10: IPos = {
// //     item0: { x: 56, y: 343},
// //     item1: { x: 154, y: 343},
// //     item2: { x: 252, y: 343},
// //     item3: { x: 56, y: 415},
// //     item4: { x: 154, y: 415},
// //     item5: { x: 252, y: 415},
// //   }

// //   for (let i = 0; i < items10_paths.length; i++) {
// //     const item = await loadImage(items10_paths[i])
// //     ctx.drawImage(item, pos10[`item${i}`].x, pos10[`item${i}`].y, item.width, item.height)
// //   }

// //   const runesp: IPos = {
// //     pos0: { x: 505, y: 325},
// //     pos1: { x: 605, y: 325},
// //     pos2: { x: 505, y: 385},
// //     pos3: { x: 605, y: 385},
// //     pos4: { x: 505, y: 445},
// //     pos5: { x: 605, y: 445},
// //     pos6: { x: 505, y: 505},
// //     pos7: { x: 605, y: 505},
// //     pos8: { x: 505, y: 565},
// //   }

// //   for (let i = 0; i < runes_paths.length; i++) {
// //     const item = await loadImage(runes_paths[i])
// //     ctx.drawImage(item, runesp[`pos${i}`].x, runesp[`pos${i}`].y, item.width * 1.75, item.height * 1.75)
// //   }

// //   ctx.font = '24px Arial'
// //   ctx.fillStyle = 'white'
// //   ctx.fillText(header, 124, 95)
// //   ctx.fillText(main, 205, 35)
// //   ctx.fillText(regen, 556, 95)
// //   ctx.fillText(items10text, 102, 325)
// //   ctx.fillText(runestext, 556, 325)
// //   ctx.font = '18px Arial'
// //   ctx.fillStyle = 'rgb(244,215,103)'
// //   ctx.fillText(networth10, 98, 502)

// //   const buffer = canvas.toBuffer('image/png')
// //   writeFileSync(outputPath, buffer)
// //   paths.forEach(path => unlinkSync(path))
// //   con_paths.forEach(path => unlinkSync(path))
// //   items10_paths.forEach(path => unlinkSync(path))
// //   runes_paths.forEach(path => unlinkSync(path))
// // }
// // //#endregion Graphic functions

// // //#region Interfaces
// // interface IPos {
// //   [key: string]: { x: number, y: number }
// // }

// interface IDotaHero {
//   [hero: string]: [number, string, string, string, string[]]
// }

// const HEROES: IDotaHero = {
//   'Anti-Mage': [1, 'npc_dota_hero_antimage', 'antimage', 'Anti-Mage', ['am', 'wei']],
//   'Axe': [2, 'npc_dota_hero_axe', 'axe', 'Axe', []],
//   'Bane': [3, 'npc_dota_hero_bane', 'bane', 'Bane', []],
//   'Bloodseeker': [4, 'npc_dota_hero_bloodseeker', 'bloodseeker', 'Bloodseeker', ['bs']],
//   'Crystal Maiden': [5, 'npc_dota_hero_crystal_maiden', 'crystal_maiden', 'Crystal Maiden', ['cm', 'rylai', 'wolf']],
//   'Drow Ranger': [6, 'npc_dota_hero_drow_ranger', 'drow_ranger', 'Drow Ranger', ['Traxex']],
//   'Earthshaker': [7, 'npc_dota_hero_earthshaker', 'earthshaker', 'Earthshaker', ['es', 'Raigor']],
//   'Juggernaut': [8, 'npc_dota_hero_juggernaut', 'juggernaut', 'Juggernaut', ['Yurnero']],
//   'Mirana': [9, 'npc_dota_hero_mirana', 'mirana', 'Mirana', ['Princess', 'Moon', 'potm']],
//   'Morphling': [10, 'npc_dota_hero_morphling', 'morphling', 'Morphling', []],
//   'Shadow Fiend': [11, 'npc_dota_hero_nevermore', 'nevermore', 'Shadow Fiend', ['sf', 'nevermore']],
//   'Phantom Lancer': [12, 'npc_dota_hero_phantom_lancer', 'phantom_lancer', 'Phantom Lancer', ['pl', 'Azwraith']],
//   'Puck': [13, 'npc_dota_hero_puck', 'puck', 'Puck', ['Faerie Dragon', 'fd']],
//   'Pudge': [14, 'npc_dota_hero_pudge', 'pudge', 'Pudge', ['Toy Butcher']],
//   'Razor': [15, 'npc_dota_hero_razor', 'razor', 'Razor', ['Lightning Revenant']],
//   'Sand King': [16, 'npc_dota_hero_sand_king', 'sand_king', 'Sand King', ['sk', 'Crixalis']],
//   'Storm Spirit': [17, 'npc_dota_hero_storm_spirit', 'storm_spirit', 'Storm Spirit', ['ss', 'raijin', 'thunderkeg']],
//   'Sven': [18, 'npc_dota_hero_sven', 'sven', 'Sven', ['Rogue Knight']],
//   'Tiny': [19, 'npc_dota_hero_tiny', 'tiny', 'Tiny', ['Stone Giant']],
//   'Vengeful Spirit': [20, 'npc_dota_hero_vengefulspirit', 'vengefulspirit', 'Vengeful Spirit', ['vs', 'Shendelzare']],
//   'Windranger': [21, 'npc_dota_hero_windrunner', 'windrunner', 'Windranger', ['wr', 'Lyralei']],
//   'Zeus': [22, 'npc_dota_hero_zuus', 'zuus', 'Zeus', ['Lord of Heaven']],
//   'Kunkka': [23, 'npc_dota_hero_kunkka', 'kunkka', 'Kunkka', ['Admiral']],
//   'Lina': [25, 'npc_dota_hero_lina', 'lina', 'Lina', ['slayer']],
//   'Lion': [26, 'npc_dota_hero_lion', 'lion', 'Lion', ['Demon Witch']],
//   'Shadow Shaman': [27, 'npc_dota_hero_shadow_shaman', 'shadow_shaman', 'Shadow Shaman', ['ss', 'Rhasta']],
//   'Slardar': [28, 'npc_dota_hero_slardar', 'slardar', 'Slardar', ['Slithereen Guard']],
//   'Tidehunter': [29, 'npc_dota_hero_tidehunter', 'tidehunter', 'Tidehunter', ['th', 'Leviathan']],
//   'Witch Doctor': [30, 'npc_dota_hero_witch_doctor', 'witch_doctor', 'Witch Doctor', ['wd', 'Zharvakko']],
//   'Lich': [31, 'npc_dota_hero_lich', 'lich', 'Lich', ['Ethreain']],
//   'Riki': [32, 'npc_dota_hero_riki', 'riki', 'Riki', ['Stealth Assassin', 'sa']],
//   'Enigma': [33, 'npc_dota_hero_enigma', 'enigma', 'Enigma', []],
//   'Tinker': [34, 'npc_dota_hero_tinker', 'tinker', 'Tinker', ['Boush']],
//   'Sniper': [35, 'npc_dota_hero_sniper', 'sniper', 'Sniper', ['Kardel Sharpeye']],
//   'Necrophos': [36, 'npc_dota_hero_necrolyte', 'necrolyte', 'Necrophos', ['Rotundjere']],
//   'Warlock': [37, 'npc_dota_hero_warlock', 'warlock', 'Warlock', ['wl', 'Demnok Lannik']],
//   'Beastmaster': [38, 'npc_dota_hero_beastmaster', 'beastmaster', 'Beastmaster', ['bm']],
//   'Queen of Pain': [39, 'npc_dota_hero_queenofpain', 'queenofpain', 'Queen of Pain', ['qop', 'Akasha']],
//   'Venomancer': [40, 'npc_dota_hero_venomancer', 'venomancer', 'Venomancer', ['Lesale']],
//   'Faceless Void': [41, 'npc_dota_hero_faceless_void', 'faceless_void', 'Faceless Void', ['fv']],
//   'Wraith King': [42, 'npc_dota_hero_skeleton_king', 'skeleton_king', 'Wraith King', ['sk', 'snk', 'wk', 'skeleton', 'one true king', 'Ostarion']],
//   'Death Prophet': [43, 'npc_dota_hero_death_prophet', 'death_prophet', 'Death Prophet', ['dp', 'Krobelus']],
//   'Phantom Assassin': [44, 'npc_dota_hero_phantom_assassin', 'phantom_assassin', 'Phantom Assassin', ['pa', 'mortred']],
//   'Pugna': [45, 'npc_dota_hero_pugna', 'pugna', 'Pugna', []],
//   'Templar Assassin': [46, 'npc_dota_hero_templar_assassin', 'templar_assassin', 'Templar Assassin', ['ta', 'Lanaya']],
//   'Viper': [47, 'npc_dota_hero_viper', 'viper', 'Viper', ['Netherdrake']],
//   'Luna': [48, 'npc_dota_hero_luna', 'luna', 'Luna', ['Moon Rider']],
//   'Dragon Knight': [49, 'npc_dota_hero_dragon_knight', 'dragon_knight', 'Dragon Knight', ['dk', 'davion', 'dragon\'s blood']],
//   'Dazzle': [50, 'npc_dota_hero_dazzle', 'dazzle', 'Dazzle', []],
//   'Clockwerk': [51, 'npc_dota_hero_rattletrap', 'rattletrap', 'Clockwerk', ['Rattletrap', 'cw']],
//   'Leshrac': [52, 'npc_dota_hero_leshrac', 'leshrac', 'Leshrac', ['ts']],
//   'Nature\'s Prophet': [53, 'npc_dota_hero_furion', 'furion', 'Nature\'s Prophet', ['np']],
//   'Lifestealer': [54, 'npc_dota_hero_life_stealer', 'life_stealer', 'Lifestealer', ['ls', 'Naix']],
//   'Dark Seer': [55, 'npc_dota_hero_dark_seer', 'dark_seer', 'Dark Seer', ['ds', 'Ishkafel']],
//   'Clinkz': [56, 'npc_dota_hero_clinkz', 'clinkz', 'Clinkz', []],
//   'Omniknight': [57, 'npc_dota_hero_omniknight', 'omniknight', 'Omniknight', ['Purist Thunderwrath']],
//   'Enchantress': [58, 'npc_dota_hero_enchantress', 'enchantress', 'Enchantress', ['Aiushtha']],
//   'Huskar': [59, 'npc_dota_hero_huskar', 'huskar', 'Huskar', []],
//   'Night Stalker': [60, 'npc_dota_hero_night_stalker', 'night_stalker', 'Night Stalker', ['ns', 'Balanar']],
//   'Broodmother': [61, 'npc_dota_hero_broodmother', 'broodmother', 'Broodmother', ['bm', 'Arachnia']],
//   'Bounty Hunter': [62, 'npc_dota_hero_bounty_hunter', 'bounty_hunter', 'Bounty Hunter', ['bh']],
//   'Weaver': [63, 'npc_dota_hero_weaver', 'weaver', 'Weaver', ['nw', 'Skitskurr']],
//   'Jakiro': [64, 'npc_dota_hero_jakiro', 'jakiro', 'Jakiro', ['thd', 'twin headed dragon']],
//   'Batrider': [65, 'npc_dota_hero_batrider', 'batrider', 'Batrider', ['br']],
//   'Chen': [66, 'npc_dota_hero_chen', 'chen', 'Chen', ['Holy Knight']],
//   'Spectre': [67, 'npc_dota_hero_spectre', 'spectre', 'Spectre', ['Mercurial']],
//   'Ancient Apparition': [68, 'npc_dota_hero_ancient_apparition', 'ancient_apparition', 'Ancient Apparition', ['aa']],
//   'Doom': [69, 'npc_dota_hero_doom_bringer', 'doom_bringer', 'Doom', ['db']],
//   'Ursa': [70, 'npc_dota_hero_ursa', 'ursa', 'Ursa', ['Ulfsaar']],
//   'Spirit Breaker': [71, 'npc_dota_hero_spirit_breaker', 'spirit_breaker', 'Spirit Breaker', ['sb', 'Barathrum']],
//   'Gyrocopter': [72, 'npc_dota_hero_gyrocopter', 'gyrocopter', 'Gyrocopter', ['Aurel']],
//   'Alchemist': [73, 'npc_dota_hero_alchemist', 'alchemist', 'Alchemist', ['Razzil']],
//   'Invoker': [74, 'npc_dota_hero_invoker', 'invoker', 'Invoker', ['kid']],
//   'Silencer': [75, 'npc_dota_hero_silencer', 'silencer', 'Silencer', ['Nortrom']],
//   'Outworld Destroyer': [76, 'npc_dota_hero_obsidian_destroyer', 'obsidian_destroyer', 'Outworld Destroyer', ['od', 'Harbinger']],
//   'Lycan': [77, 'npc_dota_hero_lycan', 'lycan', 'Lycan', ['Banehallow', 'wolf']],
//   'Brewmaster': [78, 'npc_dota_hero_brewmaster', 'brewmaster', 'Brewmaster', ['bm', 'Mangix']],
//   'Shadow Demon': [79, 'npc_dota_hero_shadow_demon', 'shadow_demon', 'Shadow Demon', ['sd']],
//   'Lone Druid': [80, 'npc_dota_hero_lone_druid', 'lone_druid', 'Lone Druid', ['ld', 'bear', 'Sylla']],
//   'Chaos Knight': [81, 'npc_dota_hero_chaos_knight', 'chaos_knight', 'Chaos Knight', ['ck']],
//   'Meepo': [82, 'npc_dota_hero_meepo', 'meepo', 'Meepo', ['geomancer', 'meepwn']],
//   'Treant Protector': [83, 'npc_dota_hero_treant', 'treant', 'Treant Protector', []],
//   'Ogre Magi': [84, 'npc_dota_hero_ogre_magi', 'ogre_magi', 'Ogre Magi', ['om']],
//   'Undying': [85, 'npc_dota_hero_undying', 'undying', 'Undying', ['Dirge']],
//   'Rubick': [86, 'npc_dota_hero_rubick', 'rubick', 'Rubick', ['rubick']],
//   'Disruptor': [87, 'npc_dota_hero_disruptor', 'disruptor', 'Disruptor', ['disruptor']],
//   'Nyx Assassin': [88, 'npc_dota_hero_nyx_assassin', 'nyx_assassin', 'Nyx Assassin', ['na']],
//   'Naga Siren': [89, 'npc_dota_hero_naga_siren', 'naga_siren', 'Naga Siren', ['naga', 'Slithice']],
//   'Keeper of the Light': [90, 'npc_dota_hero_keeper_of_the_light', 'keeper_of_the_light', 'Keeper of the Light', ['keeper', 'ezalor', 'kotl']],
//   'Io': [91, 'npc_dota_hero_wisp', 'wisp', 'Io', ['wisp']],
//   'Visage': [92, 'npc_dota_hero_visage', 'visage', 'Visage', ['visage', 'Necrolic']],
//   'Slark': [93, 'npc_dota_hero_slark', 'slark', 'Slark', ['slark']],
//   'Medusa': [94, 'npc_dota_hero_medusa', 'medusa', 'Medusa', ['medusa', 'gorgon']],
//   'Troll Warlord': [95, 'npc_dota_hero_troll_warlord', 'troll_warlord', 'Troll Warlord', ['troll', 'jahrakal']],
//   'Centaur Warrunner': [96, 'npc_dota_hero_centaur', 'centaur', 'Centaur Warrunner', ['centaur']],
//   'Magnus': [97, 'npc_dota_hero_magnataur', 'magnataur', 'Magnus', ['magnataur', 'magnus']],
//   'Timbersaw': [98, 'npc_dota_hero_shredder', 'shredder', 'Timbersaw', ['Rizzrack', 'Shredder', 'Timbersaw']],
//   'Bristleback': [99, 'npc_dota_hero_bristleback', 'bristleback', 'Bristleback', ['Rigwarl', 'bb']],
//   'Tusk': [100, 'npc_dota_hero_tusk', 'tusk', 'Tusk', ['Ymir']],
//   'Skywrath Mage': [101, 'npc_dota_hero_skywrath_mage', 'skywrath_mage', 'Skywrath Mage', ['sm', 'Dragonus']],
//   'Abaddon': [102, 'npc_dota_hero_abaddon', 'abaddon', 'Abaddon', ['Abaddon']],
//   'Elder Titan': [103, 'npc_dota_hero_elder_titan', 'elder_titan', 'Elder Titan', ['TC', 'Cairne', 'et']],
//   'Legion Commander': [104, 'npc_dota_hero_legion_commander', 'legion_commander', 'Legion Commander', ['Tresdin', 'Legion', 'lc']],
//   'Techies': [105, 'npc_dota_hero_techies', 'techies', 'Techies', ['Squee', 'Spleen', 'Spoon']],
//   'Ember Spirit': [106, 'npc_dota_hero_ember_spirit', 'ember_spirit', 'Ember Spirit', ['Xin', 'Ember', 'es']],
//   'Earth Spirit': [107, 'npc_dota_hero_earth_spirit', 'earth_spirit', 'Earth Spirit', ['es', 'Kaolin', 'Earth']],
//   'Underlord': [108, 'npc_dota_hero_abyssal_underlord', 'abyssal_underlord', 'Underlord', ['PitLord', 'Azgalor', 'ul']],
//   'Terrorblade': [109, 'npc_dota_hero_terrorblade', 'terrorblade', 'Terrorblade', ['tb']],
//   'Phoenix': [110, 'npc_dota_hero_phoenix', 'phoenix', 'Phoenix', ['ph']],
//   'Oracle': [111, 'npc_dota_hero_oracle', 'oracle', 'Oracle', ['ora', 'Nerif']],
//   'Winter Wyvern': [112, 'npc_dota_hero_winter_wyvern', 'winter_wyvern', 'Winter Wyvern', ['ww', 'Auroth']],
//   'Arc Warden': [113, 'npc_dota_hero_arc_warden', 'arc_warden', 'Arc Warden', ['zet', 'aw']],
//   'Monkey King': [114, 'npc_dota_hero_monkey_king', 'monkey_king', 'Monkey King', ['mk', 'Sun Wukong']],
//   'Dark Willow': [119, 'npc_dota_hero_dark_willow', 'dark_willow', 'Dark Willow', ['dw', 'Mireska']],
//   'Pangolier': [120, 'npc_dota_hero_pangolier', 'pangolier', 'Pangolier', ['ar']],
//   'Grimstroke': [121, 'npc_dota_hero_grimstroke', 'grimstroke', 'Grimstroke', ['gs']],
//   'Hoodwink': [123, 'npc_dota_hero_hoodwink', 'hoodwink', 'Hoodwink', ['squirrel', 'hw']],
//   'Void Spirit': [126, 'npc_dota_hero_void_spirit', 'void_spirit', 'Void Spirit', ['Void', 'VS', 'Inai']],
//   'Snapfire': [128, 'npc_dota_hero_snapfire', 'snapfire', 'Snapfire', ['snap', 'mortimer']],
//   'Mars': [129, 'npc_dota_hero_mars', 'mars', 'Mars', ['mars']],
//   'Dawnbreaker': [135, 'npc_dota_hero_dawnbreaker', 'dawnbreaker', 'Dawnbreaker', ['Dawnbreaker', 'Valora']],
//   'Marci': [136, 'npc_dota_hero_marci', 'marci', 'Marci', []],
//   'Primal Beast': [137, 'npc_dota_hero_primal_beast', 'primal_beast', 'Primal Beast', []],
//   'Muerta': [138, 'npc_dota_hero_muerta', 'muerta', 'Muerta', []]
// }

// const IMG_PATH  = 'src/commands/dota2/image/'
// const ENDPOINT = 'https://api.stratz.com/graphql'
// const graphQLClient = new GraphQLClient(ENDPOINT, { headers: { authorization: `Bearer ${process.env.stratz}` }})
// const DOTA_ITEM_IMAGE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/'
// const DOTA_ABILITY_IMAGE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/'
// const DOTA_TALENT_TREE_IMAGE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg'
// const DOTA_RUNE_IMAGE = 'https://cdn.stratz.com/images/dota2/runes/'

// export default {
//   name: 'hero',
//   description: 'IB&SB',
//   options: [
//     {
//       name: 'hero',
//       description: 'The hero name',
//       type: 'String',
//       required: true,
//       autocomplete: true,
//     },
//     {
//       name: 'position',
//       description: 'position',
//       type: 'String',
//       required: true,
//       choices: [
//         { name: 'Carry',        value: 'POSITION_1'},
//         { name: 'Mid',          value: 'POSITION_2'},
//         { name: 'Offlane',      value: 'POSITION_3'},
//         { name: 'Soft Support', value: 'POSITION_4'},
//         { name: 'Hard Support', value: 'POSITION_5'},
//       ]
//     },
//     {
//       name: 'with-hero',
//       description: 'The hero id to include in this query',
//       type: 'Integer',
//       required: false,
//     },
//     {
//       name: 'against-hero',
//       description: 'The hero id to include in this query',
//       type: 'Integer',
//       required: false,
//     },
//     {
//       name: 'is-pro',
//       description: 'Determines that the query require the results come with a player that is qualified as a Pro',
//       type: 'Boolean',
//       required: false,
//     },
//     {
//       name: 'skip',
//       description: 'The amount of data to skip before collecting your query',
//       type: 'Integer',
//       required: false,
//     },
//   ],
//   guilds: ['1150427580734906368'],
//   isOwnerOnly: true,
//   autocomplete: async (interaction) => {
//     const focused = interaction.options.getFocused(true)

//     if (focused.name === 'hero') {
//       const filtered = Object.keys(HEROES).filter(hero => hero.toLowerCase().startsWith(focused.value.toLowerCase()) || hero.toLowerCase().startsWith(focused.value.toLowerCase()))
//       console.log(filtered)
//       await interaction.respond(
//         filtered.map(hero => ({ name: hero, value: hero }))
//       )
//     }
//   },
//   callback: async (interaction) => {
//     await interaction.deferReply({ ephemeral: true })
//     if (!existsSync(join(__dirname, 'image/'))) mkdirSync(join(__dirname, 'image/'))

//     const hero        = interaction.options.get('hero')?.value as string

//     console.log(hero)
//     // const pos         = interaction.options.get('position')?.value as string
//     // const withHero    = interaction.options.get('with-hero')?.value as number
//     // const againstHero = interaction.options.get('against-hero')?.value as number
//     // const isPro       = interaction.options.get('is-pro')?.value as boolean
//     // const skip        = interaction.options.get('skip')?.value as number ?? 0

// //     if (!HEROES[hero]) {
// //       await interaction.editReply({ content: '<:poel:1168156790245040169>' })
// //       return
// //     }

// //     const heroIcon    = `https://cdn.stratz.com/images/dota2/heroes/${NPCS[hero]}_vert.png`
// //     const heroImg     = `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${NPCS[hero]}.png`

// //     if (withHero && !HEROES[withHero]) {
// //       await interaction.editReply({ content: '<:poel:1168156790245040169>' })
// //       return
// //     }

// //     if (againstHero && !HEROES[againstHero]) {
// //       await interaction.editReply({ content: '<:poel:1168156790245040169>' })
// //       return
// //     }

// //     let HERO_GUIDE_ARGS = `heroId: ${hero}, positionId: ${pos}`
// //     if (withHero) HERO_GUIDE_ARGS    += `, withHeroId: ${withHero}`
// //     if (againstHero) HERO_GUIDE_ARGS += `, againstHeroId: ${againstHero}`
// //     if (isPro) HERO_GUIDE_ARGS       += `, isPro: ${isPro}`

// //     const MAIN_GQL = gql`{ heroStats { guide(${HERO_GUIDE_ARGS}) { matchCount guides(take: 1, skip: ${skip}) { steamAccountId }}}}`
// //     const MAIN_DATA: any = await graphQLClient.request(MAIN_GQL)

// //     if (MAIN_DATA.heroStats.guide.length <= 0) {
// //       await interaction.editReply({ content: `<:poel:1168156790245040169>` })
// //       return
// //     }

// //     if (MAIN_DATA.heroStats.guide[0].guides === null) {
// //       await interaction.editReply({ content: '<:poel:1168156790245040169>' })
// //       return
// //     }

// //     const steamId = MAIN_DATA.heroStats.guide[0].guides[0].steamAccountId
// //     const HERO_GUIDE_GQL = gql`{ heroStats { guide(${HERO_GUIDE_ARGS}) { guides(take: 1, skip: ${skip}) { match { durationSeconds id players(steamAccountId: ${steamId}) { kills deaths assists imp goldPerMinute experiencePerMinute numLastHits numDenies heroDamage towerDamage heroHealing playbackData { runeEvents { time rune action } playerUpdateGoldEvents { time networth } itemUsedEvents { time itemId attacker target} healEvents { time byItem} inventoryEvents { time item0 { itemId charges } item1 { itemId charges } item2 { itemId charges } item3 { itemId charges } item4 { itemId charges } item5 { itemId charges }} purchaseEvents { time itemId }}}}}}}}`
// //     const HERO_GUIDE_DATA: any = await graphQLClient.request(HERO_GUIDE_GQL)

// //     const playerData = HERO_GUIDE_DATA.heroStats.guide[0].guides[0].match.players[0]
// //     const matchData = HERO_GUIDE_DATA.heroStats.guide[0].guides[0].match
// // //#endregion Init

// // //#region generalStatisticsPage
// //     const generalStatisticsPage = new EmbedBuilder()
// //       .setColor('DarkPurple')
// //       .setFooter({ text: `Data provided by STRATZ.com`, iconURL: `https://stratz.com/images/stratz_knowledge_graph_logo.png` })
// //       .setTitle(`Guide for ${HEROES[hero]}`)
// //       .setThumbnail(heroIcon)
// //       .setDescription('General statistics')
// //       .setImage(heroImg)
// //       .addFields(
// //         { name: 'KDA',      value: `${playerData.kills}/${playerData.deaths}/${playerData.assists}`, inline: true},
// //         { name: 'GPMXPM',   value: `${playerData.goldPerMinute}/${playerData.experiencePerMinute}`, inline: true },
// //         { name: 'LH/DN',    value: `${playerData.numLastHits}/${playerData.numDenies}`, inline: true },
// //         { name: 'HeroDmg',  value: `${playerData.heroDamage}`, inline: true },
// //         { name: 'TowerDmg', value: `${playerData.towerDamage}`, inline: true },
// //         { name: 'Healing',  value: `${playerData.heroHealing}`, inline: true },
// //         { name: 'Playtime', value: `${formatTime(matchData.durationSeconds)}`, inline: true },
// //         { name: 'Impact',   value: `${playerData.imp}`, inline: true },
// //         { name: 'Match',    value: `[Click me](https://stratz.com/matches/${matchData.id})`, inline: true }
// //       )
// // //#endregion generalStatisticsPage

// // //#region itemBuildEarlyPage
// //     const starting_items_index = indexOfMinNegativeValue(playerData.playbackData.inventoryEvents)
// //     let consumables: IDotaItemCons = {}
// //     for (let i = 0; i < Object.entries(playerData.playbackData.healEvents).length; i++) {
// //       const minutes = parseInt(formatTime(playerData.playbackData.healEvents[i].time).split(':')[0], 10)
// //       if (minutes < 10) {
// //         if (consumables[`${playerData.playbackData.healEvents[i].byItem}`] === undefined) consumables[`${playerData.playbackData.healEvents[i].byItem}`] = 1
// //         else consumables[`${playerData.playbackData.healEvents[i].byItem}`]++
// //       } else {
// //         break
// //       }
// //     }
// //     for (let i = 0; i < Object.entries(playerData.playbackData.itemUsedEvents).length; i++) {
// //       const minutes = parseInt(formatTime(playerData.playbackData.itemUsedEvents[i].time).split(':')[0], 10)
// //       if (minutes < 10) {
// //         if (playerData.playbackData.itemUsedEvents[i].attacker != playerData.playbackData.itemUsedEvents[i].target) continue
// //         if (playerData.playbackData.itemUsedEvents[i].itemId == '38' || playerData.playbackData.itemUsedEvents[i].itemId == '216') {
// //           if (consumables[`${playerData.playbackData.itemUsedEvents[i].itemId}`] === undefined) consumables[`${playerData.playbackData.itemUsedEvents[i].itemId}`] = 1
// //           else consumables[`${playerData.playbackData.itemUsedEvents[i].itemId}`]++
// //         } else {
// //           break
// //         }
// //       } else {
// //         break
// //       }
// //     }

// //     let items10: IDotaItem = {}
// //     let networth10 = ''
// //     for (let i = 0; i < Object.entries(playerData.playbackData.inventoryEvents).length; i++) {
// //       const minutes = parseInt(formatTime(playerData.playbackData.inventoryEvents[i].time).split(':')[0], 10)
// //       if (minutes < 10) {} else {
// //         for (const id in playerData.playbackData.inventoryEvents[i]) {
// //           if (playerData.playbackData.inventoryEvents[i].hasOwnProperty(id) && id !== 'time') {
// //             const value: any = playerData.playbackData.inventoryEvents[i][id]
// //             if (value !== null) items10[`${id}`] = `${ITEM_NAMES[value.itemId]}`
// //           }
// //         }
// //         break
// //       }
// //     }
// //     for (let i = 0; i < Object.entries(playerData.playbackData.playerUpdateGoldEvents).length; i++) {
// //       const minutes = parseInt(formatTime(playerData.playbackData.playerUpdateGoldEvents[i].time).split(':')[0], 10)
// //       if (minutes < 10) {} else {
// //         networth10 = playerData.playbackData.playerUpdateGoldEvents[i].networth
// //         break
// //       }
// //     }

// //     let runes: IDotaItemCons = {}
// //     for (let i = 0; i < Object.entries(playerData.playbackData.runeEvents).length; i++) {
// //       const minutes = parseInt(formatTime(playerData.playbackData.runeEvents[i].time).split(':')[0], 10)
// //       if (minutes < 10) {
// //         if (playerData.playbackData.runeEvents[i].action == 'PICKUP') {
// //           if (runes[`${String(playerData.playbackData.runeEvents[i].rune).toLowerCase()}`] == undefined) runes[`${String(playerData.playbackData.runeEvents[i].rune).toLowerCase()}`] = 1
// //           else runes[`${String(playerData.playbackData.runeEvents[i].rune).toLowerCase()}`]++
// //         }
// //       } else {
// //         break
// //       }
// //     }

// //     const ibegFilePath = join(__dirname, `image/${interaction.id}.png`)
// //     await generateItemBuildEarlyGameImage(`Early Game and Laning for ${HEROES[hero]}`, 'Starting items', 'Regen', consumables, playerData.playbackData.inventoryEvents[starting_items_index], 'Items at 10 minute', items10, networth10, 'Runes', runes, ibegFilePath)
// //     const ibegUrl = await uploadToImgur(`${process.env.imgur}`, ibegFilePath)
// //     const itemBuildEarlyPage = new EmbedBuilder()
// //       .setColor('DarkPurple')
// //       .setFooter({ text: `Data provided by STRATZ.com`, iconURL: `https://stratz.com/images/stratz_knowledge_graph_logo.png` })
// //       .setTitle(`Guide for ${HEROES[hero]}`)
// //       .setThumbnail(heroIcon)
// //       .setDescription(`Early Game for ${HEROES[hero]}`)
// //       .setImage(ibegUrl)
// // //#endregion itemBuildEarlyPage

// //   const itemBuildMidPage = new EmbedBuilder()
// //     .setColor('DarkPurple')
// //     .setFooter({ text: `Data provided by STRATZ.com`, iconURL: `https://stratz.com/images/stratz_knowledge_graph_logo.png` })
// //     .setTitle(`Guide for ${HEROES[hero]}`)
// //     .setThumbnail(heroIcon)
// //     .setDescription(`Mid Game for ${HEROES[hero]}`)
// // //#region Pagination
// //     const embeds: EmbedBuilder[] = []
// //     embeds.push(generalStatisticsPage, itemBuildEarlyPage, itemBuildMidPage)

// //     const pages = {} as { [key: string]: number }

// //     const getRow = (id: string) => {
// //       const row = new ActionRowBuilder()

// //       row.addComponents(
// //         new ButtonBuilder()
// //           .setCustomId('prev_embed')
// //           .setStyle(ButtonStyle.Secondary)
// //           .setLabel('◀️')
// //           .setDisabled(pages[id] === 0)
// //       )

// //       row.addComponents(
// //         new ButtonBuilder()
// //           .setCustomId('next_embed')
// //           .setStyle(ButtonStyle.Secondary)
// //           .setLabel('▶️')
// //           .setDisabled(pages[id] === embeds.length - 1)
// //       )

// //       return row
// //     }

// //     const id = interaction.user.id
// //     pages[id] = pages[id] || 0

// //     const embed = embeds[pages[id]]
// //     const filter = (i: Interaction) => i.user.id === interaction.user.id
// //     const time = 1000 * 60 * 5

// //     await interaction.editReply({
// //       embeds: [embed],
// //       components: [getRow(id) as any],
// //     })

// //     const collector = interaction.channel?.createMessageComponentCollector({ filter, time })
// //     if (!collector) return

// //     collector.on('collect', (button) => {
// //       if (!button) return
// //       if (button.message.interaction?.id != interaction.id) return

// //       button.deferUpdate()

// //       if (button.customId !== 'prev_embed' && button.customId !== 'next_embed') return

// //       if (button.customId === 'prev_embed' && pages[id] > 0) --pages[id]
// //       else if (button.customId === 'next_embed' && pages[id] < embeds.length - 1) ++pages[id]

// //       interaction.editReply({
// //         embeds: [embeds[pages[id]]],
// //         components: [getRow(id) as any]
// //       })
// //     })
// //     unlinkSync(ibegFilePath)
//   },
// } as SlashCommand