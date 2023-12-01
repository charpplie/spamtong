//#region Imports
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction } from 'discord.js'
import { writeFileSync, readFileSync, unlinkSync, createWriteStream, existsSync, mkdirSync, write } from 'fs'
import { gql, GraphQLClient } from 'graphql-request'
import { createCanvas, loadImage } from 'canvas'
import { SlashCommand } from '@/comx'
import { join } from 'path'
import axios from 'axios'
//#endregion Imports

//#region Utils
function formatTime(seconds: number): string {
  const minutes: number = Math.floor(seconds / 60)
  const remainingSeconds: number = seconds % 60

  const formattedMinutes: string = minutes < 10 ? `0${minutes}` : `${minutes}`
  const formattedSeconds: string = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`

  return `${formattedMinutes}:${formattedSeconds}`
}

function indexOfMinNegativeValue(array: any[]): number {
  let maxNegativeIndex: number = 0
  let maxNegativeValue: number = 0

  for (let i = 0; i < array.length; i++) {
    const element = array[i].time
    if (element < 0 && (maxNegativeValue === 0 || element > maxNegativeValue)) {
      maxNegativeValue = element
      maxNegativeIndex = i
    }
  }

  return maxNegativeIndex
}

function generateRandomText(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let randomText = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomText += characters.charAt(randomIndex)
  }

  return randomText
}

async function uploadToImgur(accessToken: string, filename: string) {
  try {
    const response = await axios.post(
      'https://api.imgur.com/3/image',
      {
        image: readFileSync(filename, 'base64'),
        type: 'base64',
      },
      {
        headers: {
          Authorization: `Client-ID ${accessToken}`,
        },
      }
    )
    return response.data.data.link
  } catch (error) {
    console.error(`Error uploading to Imgur: ${error}`)
    throw error
  }
}
//#endregion Utils

//#region Graphic functions
async function drawOnImage(imagePath: string, text: string, outputPath: string) {
  const image = await loadImage(imagePath)
  const canvas = createCanvas(image.width, image.height)
  const ctx = canvas.getContext('2d')

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

  ctx.font = '24px Arial'
  ctx.fillStyle = 'white'
  ctx.fillText(text, canvas.width - 25, canvas.height - 5)

  const buffer = canvas.toBuffer('image/png')
  writeFileSync(outputPath, buffer)
}

async function generateItemBuildEarlyGameImage(main: string, header: string, regen: string, regen_items: IDotaItemCons, items: IDotaItem, items10text: string, items10: IDotaItem, networth10: string, runestext: string, runes: IDotaItemCons, outputPath: string) {
  let paths = []
  let con_paths = []
  let items10_paths = []
  let runes_paths = []
  if (Object.entries(items).length - 1 > 0) {
    for (const id in items) {
      if (items.hasOwnProperty(id) && id !== 'time') {
        const value: any = items[id]
        if (value !== null) {
          const image = DOTA_ITEM_IMAGE + `${ITEM_NAMES[value.itemId].replace(/item_/gi, '')}.png`

          const filePath = join(__dirname, `image/${id}${generateRandomText(12)}.png`)
          const writer = createWriteStream(filePath)

          const response = await axios({
            url: image,
            method: 'GET',
            responseType: 'stream',
          })

          response.data.pipe(writer)

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
          })

          paths.push(filePath)

          if (value.charges > 0) {
            if (value.itemId === 44) {
              const charge = value.charges / 3
              if (charge > 1) {
                await drawOnImage(filePath, `x${charge}`, filePath)
              }
            } else {
              if (value.charges > 1) {
                await drawOnImage(filePath, `x${value.charges}`, filePath)
              }
            }
          }
        }
      }
    }
  }

  if (Object.entries(regen_items).length > 0) {
    for (const id in regen_items) {
      if (regen_items.hasOwnProperty(id) && regen_items[id] !== 0) {
        const value: any = regen_items[id]
        if (value !== null && ITEMS[id]) {
          const image = DOTA_ITEM_IMAGE + `${ITEM_NAMES[id].replace(/item_/gi, '')}.png`

          const filePath = join(__dirname, `image/${id}${generateRandomText(12)}.png`)
          const writer = createWriteStream(filePath)

          const response = await axios({
            url: image,
            method: 'GET',
            responseType: 'stream',
          })

          response.data.pipe(writer)

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
          })

          con_paths.push(filePath)

          await drawOnImage(filePath, `x${regen_items[id]}`, filePath)
        }
      }
    }
  }

  if (Object.entries(items10).length - 1 > 0) {
    for (const id in items10) {
      if (items10.hasOwnProperty(id) && id !== 'time') {
        const value: any = items10[id]
        if (value !== null) {
          const image = DOTA_ITEM_IMAGE + `${value.replace(/item_/gi, '')}.png`

          const filePath = join(__dirname, `image/${id}${generateRandomText(12)}.png`)
          const writer = createWriteStream(filePath)

          const response = await axios({
            url: image,
            method: 'GET',
            responseType: 'stream',
          })

          response.data.pipe(writer)

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
          })

          items10_paths.push(filePath)
        }
      }
    }
  }

  if (Object.entries(runes).length - 1 > 0) {
    let i = 0
    for (const id in runes) {
      if (runes.hasOwnProperty(id)) {
        const value: any = runes[id]
        if (value !== null) {
          const rune = Object.keys(runes)[i]
          i++
          const image = DOTA_RUNE_IMAGE + `${rune}.png`

          const filePath = join(__dirname, `image/${id}${generateRandomText(12)}.png`)
          const writer = createWriteStream(filePath)

          const response = await axios({
            url: image,
            method: 'GET',
            responseType: 'stream',
          })

          response.data.pipe(writer)

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
          })

          runes_paths.push(filePath)

          await drawOnImage(filePath, `x${value}`, filePath)
        }
      }
    }
  }

  const canvas = createCanvas(800, 600)
  const ctx = canvas.getContext('2d')

  const background = await loadImage(BG_PATH)
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

  const inv = await loadImage(INV_PATH)
  ctx.drawImage(inv, 50, 105, inv.width * 1.115, inv.height * 1.115)
  ctx.drawImage(inv, 50, 335, inv.width * 1.115, inv.height * 1.115)

  const gold = await loadImage(GOLD_PATH)
  ctx.drawImage(gold, 52, 485, gold.width / 2.35, gold.height / 2.35)

  const pos: IPos = {
    item0: { x: 56, y: 113},
    item1: { x: 154, y: 113},
    item2: { x: 252, y: 113},
    item3: { x: 56, y: 185},
    item4: { x: 154, y: 185},
    item5: { x: 252, y: 185},
  }

  for (let i = 0; i < paths.length; i++) {
    const item = await loadImage(paths[i])
    ctx.drawImage(item, pos[`item${i}`].x, pos[`item${i}`].y, item.width, item.height)
  }

  const cons_pos: IPos = {
    pos0: { x: 400, y: 113},
    pos1: { x: 500, y: 113},
    pos2: { x: 600, y: 113},
    pos3: { x: 700, y: 113},
    pos4: { x: 400, y: 185},
    pos5: { x: 500, y: 185},
    pos6: { x: 600, y: 185},
    pos7: { x: 700, y: 185},
    pos8: { x: 400, y: 257},
    pos9: { x: 500, y: 257},
    pos10: { x: 600, y: 257},
    pos11: { x: 700, y: 257},
  }

  for (let i = 0; i < con_paths.length; i++) {
    const item = await loadImage(con_paths[i])
    ctx.drawImage(item, cons_pos[`pos${i}`].x, cons_pos[`pos${i}`].y, item.width, item.height)
  }

  const pos10: IPos = {
    item0: { x: 56, y: 343},
    item1: { x: 154, y: 343},
    item2: { x: 252, y: 343},
    item3: { x: 56, y: 415},
    item4: { x: 154, y: 415},
    item5: { x: 252, y: 415},
  }

  for (let i = 0; i < items10_paths.length; i++) {
    const item = await loadImage(items10_paths[i])
    ctx.drawImage(item, pos10[`item${i}`].x, pos10[`item${i}`].y, item.width, item.height)
  }

  const runesp: IPos = {
    pos0: { x: 505, y: 325},
    pos1: { x: 605, y: 325},
    pos2: { x: 505, y: 385},
    pos3: { x: 605, y: 385},
    pos4: { x: 505, y: 445},
    pos5: { x: 605, y: 445},
    pos6: { x: 505, y: 505},
    pos7: { x: 605, y: 505},
    pos8: { x: 505, y: 565},
  }

  for (let i = 0; i < runes_paths.length; i++) {
    const item = await loadImage(runes_paths[i])
    ctx.drawImage(item, runesp[`pos${i}`].x, runesp[`pos${i}`].y, item.width * 1.75, item.height * 1.75)
  }

  ctx.font = '24px Arial'
  ctx.fillStyle = 'white'
  ctx.fillText(header, 124, 95)
  ctx.fillText(main, 205, 35)
  ctx.fillText(regen, 556, 95)
  ctx.fillText(items10text, 102, 325)
  ctx.fillText(runestext, 556, 325)
  ctx.font = '18px Arial'
  ctx.fillStyle = 'rgb(244,215,103)'
  ctx.fillText(networth10, 98, 502)

  const buffer = canvas.toBuffer('image/png')
  writeFileSync(outputPath, buffer)
  paths.forEach(path => unlinkSync(path))
  con_paths.forEach(path => unlinkSync(path))
  items10_paths.forEach(path => unlinkSync(path))
  runes_paths.forEach(path => unlinkSync(path))
}
//#endregion Graphic functions

//#region Interfaces
interface IPos {
  [key: string]: { x: number, y: number }
}

interface IDotaHero {
  [id: number]: string
}

interface IDotaItem {
  [id: string]: string
}

interface IDotaItemCons {
  [id: string]: number
}
//#endregion Interfaces

//#region Dota Constants
const HEROES: IDotaHero = {
  [1]: 'Anti-Mage',
  [2]: 'Axe',
  [3]: 'Bane',
  [4]: 'Bloodseeker',
  [5]: 'Crystal Maiden',
  [6]: 'Drow Ranger',
  [7]: 'Earthshaker',
  [8]: 'Juggernaut',
  [9]: 'Mirana',
  [10]: 'Morphling',
  [11]: 'Shadow Fiend',
  [12]: 'Phantom Lancer',
  [13]: 'Puck',
  [14]: 'Pudge',
  [15]: 'Razor',
  [16]: 'Sand King',
  [17]: 'Storm Spirit',
  [18]: 'Sven',
  [19]: 'Tiny',
  [20]: 'Vengeful Spirit',
  [21]: 'Windranger',
  [22]: 'Zeus',
  [23]: 'Kunkka',
  [25]: 'Lina',
  [26]: 'Lion',
  [27]: 'Shadow Shaman',
  [28]: 'Slardar',
  [29]: 'Tidehunter',
  [30]: 'Witch Doctor',
  [31]: 'Lich',
  [32]: 'Riki',
  [33]: 'Enigma',
  [34]: 'Tinker',
  [35]: 'Sniper',
  [36]: 'Necrophos',
  [37]: 'Warlock',
  [38]: 'Beastmaster',
  [39]: 'Queen of Pain',
  [40]: 'Venomancer',
  [41]: 'Faceless Void',
  [42]: 'Wraith King',
  [43]: 'Death Prophet',
  [44]: 'Phantom Assassin',
  [45]: 'Pugna',
  [46]: 'Templar Assassin',
  [47]: 'Viper',
  [48]: 'Luna',
  [49]: 'Dragon Knight',
  [50]: 'Dazzle',
  [51]: 'Clockwerk',
  [52]: 'Leshrac',
  [53]: 'Nature\'s Prophet',
  [54]: 'Lifestealer',
  [55]: 'Dark Seer',
  [56]: 'Clinkz',
  [57]: 'Omniknight',
  [58]: 'Enchantress',
  [59]: 'Huskar',
  [60]: 'Night Stalker',
  [61]: 'Broodmother',
  [62]: 'Bounty Hunter',
  [63]: 'Weaver',
  [64]: 'Jakiro',
  [65]: 'Batrider',
  [66]: 'Chen',
  [67]: 'Spectre',
  [68]: 'Ancient Apparition',
  [69]: 'Doom',
  [70]: 'Ursa',
  [71]: 'Spirit Breaker',
  [72]: 'Gyrocopter',
  [73]: 'Alchemist',
  [74]: 'Invoker',
  [75]: 'Silencer',
  [76]: 'Outworld Destroyer',
  [77]: 'Lycan',
  [78]: 'Brewmaster',
  [79]: 'Shadow Demon',
  [80]: 'Lone Druid',
  [81]: 'Chaos Knight',
  [82]: 'Meepo',
  [83]: 'Treant Protector',
  [84]: 'Ogre Magi',
  [85]: 'Undying',
  [86]: 'Rubick',
  [87]: 'Disruptor',
  [88]: 'Nyx Assassin',
  [89]: 'Naga Siren',
  [90]: 'Keeper of the Light',
  [91]: 'Io',
  [92]: 'Visage',
  [93]: 'Slark',
  [94]: 'Medusa',
  [95]: 'Troll Warlord',
  [96]: 'Centaur Warrunner',
  [97]: 'Magnus',
  [98]: 'Timbersaw',
  [99]: 'Bristleback',
  [100]: 'Tusk',
  [101]: 'Skywrath Mage',
  [102]: 'Abaddon',
  [103]: 'Elder Titan',
  [104]: 'Legion Commander',
  [105]: 'Techies',
  [106]: 'Ember Spirit',
  [107]: 'Earth Spirit',
  [108]: 'Underlord',
  [109]: 'Terrorblade',
  [110]: 'Phoenix',
  [111]: 'Oracle',
  [112]: 'Winter Wyvern',
  [113]: 'Arc Warden',
  [114]: 'Monkey King',
  [119]: 'Dark Willow',
  [120]: 'Pangolier',
  [121]: 'Grimstroke',
  [123]: 'Hoodwink',
  [126]: 'Void Spirit',
  [128]: 'Snapfire',
  [129]: 'Mars',
  [135]: 'Dawnbreaker',
  [136]: 'Marci',
  [137]: 'Primal Beast',
  [138]: 'Muerta',
}

const NPCS: IDotaHero = {
  [1]: 'antimage',
  [2]: 'axe',
  [3]: 'bane',
  [4]: 'bloodseeker',
  [5]: 'crystal_maiden',
  [6]: 'drow_ranger',
  [7]: 'earthshaker',
  [8]: 'juggernaut',
  [9]: 'mirana',
  [10]: 'morphling',
  [11]: 'nevermore',
  [12]: 'phantom_lancer',
  [13]: 'puck',
  [14]: 'pudge',
  [15]: 'razor',
  [16]: 'sand_king',
  [17]: 'storm_spirit',
  [18]: 'sven',
  [19]: 'tiny',
  [20]: 'vengefulspirit',
  [21]: 'windrunner',
  [22]: 'zuus',
  [23]: 'kunkka',
  [25]: 'lina',
  [26]: 'lion',
  [27]: 'shadow_shaman',
  [28]: 'slardar',
  [29]: 'tidehunter',
  [30]: 'witch_doctor',
  [31]: 'lich',
  [32]: 'riki',
  [33]: 'enigma',
  [34]: 'tinker',
  [35]: 'sniper',
  [36]: 'necrolyte',
  [37]: 'warlock',
  [38]: 'beastmaster',
  [39]: 'queenofpain',
  [40]: 'venomancer',
  [41]: 'faceless_void',
  [42]: 'skeleton_king',
  [43]: 'death_prophet',
  [44]: 'phantom_assassin',
  [45]: 'pugna',
  [46]: 'templar_assassin',
  [47]: 'viper',
  [48]: 'luna',
  [49]: 'dragon_knight',
  [50]: 'dazzle',
  [51]: 'rattletrap',
  [52]: 'leshrac',
  [53]: 'furion',
  [54]: 'life_stealer',
  [55]: 'dark_seer',
  [56]: 'clinkz',
  [57]: 'omniknight',
  [58]: 'enchantress',
  [59]: 'huskar',
  [60]: 'night_stalker',
  [61]: 'broodmother',
  [62]: 'bounty_hunter',
  [63]: 'weaver',
  [64]: 'jakiro',
  [65]: 'batrider',
  [66]: 'chen',
  [67]: 'spectre',
  [68]: 'ancient_apparition',
  [69]: 'doom_bringer',
  [70]: 'ursa',
  [71]: 'spirit_breaker',
  [72]: 'gyrocopter',
  [73]: 'alchemist',
  [74]: 'invoker',
  [75]: 'silencer',
  [76]: 'obsidian_destroyer',
  [77]: 'lycan',
  [78]: 'brewmaster',
  [79]: 'shadow_demon',
  [80]: 'lone_druid',
  [81]: 'chaos_knight',
  [82]: 'meepo',
  [83]: 'treant',
  [84]: 'ogre_magi',
  [85]: 'undying',
  [86]: 'rubick',
  [87]: 'disruptor',
  [88]: 'nyx_assassin',
  [89]: 'naga_siren',
  [90]: 'keeper_of_the_light',
  [91]: 'wisp',
  [92]: 'visage',
  [93]: 'slark',
  [94]: 'medusa',
  [95]: 'troll_warlord',
  [96]: 'centaur',
  [97]: 'magnataur',
  [98]: 'shredder',
  [99]: 'bristleback',
  [100]: 'tusk',
  [101]: 'skywrath_mage',
  [102]: 'abaddon',
  [103]: 'elder_titan',
  [104]: 'legion_commander',
  [105]: 'techies',
  [106]: 'ember_spirit',
  [107]: 'earth_spirit',
  [108]: 'abyssal_underlord',
  [109]: 'terrorblade',
  [110]: 'phoenix',
  [111]: 'oracle',
  [112]: 'winter_wyvern',
  [113]: 'arc_warden',
  [114]: 'monkey_king',
  [119]: 'dark_willow',
  [120]: 'pangolier',
  [121]: 'grimstroke',
  [123]: 'hoodwink',
  [126]: 'void_spirit',
  [128]: 'snapfire',
  [129]: 'mars',
  [135]: 'dawnbreaker',
  [136]: 'marci',
  [137]: 'primal_beast',
  [138]: 'muerta',
}

const ITEMS: IDotaItem = {
  [1]: 'Blink Dagger',
  [2]: 'Blades of Attack',
  [3]: 'Broadsword',
  [4]: 'Chainmail',
  [5]: 'Claymore',
  [6]: 'Helm of Iron Will',
  [7]: 'Javelin',
  [8]: 'Mithril Hammer',
  [9]: 'Platemail',
  [10]: 'Quarterstaff',
  [11]: 'Quelling Blade',
  [12]: 'Ring of Protection',
  [13]: 'Gauntlets of Strength',
  [14]: 'Slippers of Agility',
  [15]: 'Mantle of Intelligence',
  [16]: 'Iron Branch',
  [17]: 'Belt of Strength',
  [18]: 'Band of Elvenskin',
  [19]: 'Robe of the Magi',
  [20]: 'Circlet',
  [21]: 'Ogre Axe',
  [22]: 'Blade of Alacrity',
  [23]: 'Staff of Wizardry',
  [24]: 'Ultimate Orb',
  [25]: 'Gloves of Haste',
  [26]: 'Morbid Mask',
  [27]: 'Ring of Regen',
  [28]: 'Sage\'s Mask',
  [29]: 'Boots of Speed',
  [30]: 'Gem of True Sight',
  [31]: 'Cloak',
  [32]: 'Talisman of Evasion',
  [33]: 'Cheese',
  [34]: 'Magic Stick',
  [35]: 'Magic Wand Recipe',
  [36]: 'Magic Wand',
  [37]: 'Ghost Scepter',
  [38]: 'Clarity',
  [39]: 'Healing Salve',
  [40]: 'Dust of Appearance',
  [41]: 'Bottle',
  [42]: 'Observer Ward',
  [43]: 'Sentry Ward',
  [44]: 'Tango',
  [45]: 'Animal Courier',
  [46]: 'Town Portal Scroll',
  [47]: 'Boots of Travel Recipe',
  [48]: 'Boots of Travel',
  [49]: '',
  [50]: 'Phase Boots',
  [51]: 'Demon Edge',
  [52]: 'Eaglesong',
  [53]: 'Reaver',
  [54]: 'Sacred Relic',
  [55]: 'Hyperstone',
  [56]: 'Ring of Health',
  [57]: 'Void Stone',
  [58]: 'Mystic Staff',
  [59]: 'Energy Booster',
  [60]: 'Point Booster',
  [61]: 'Vitality Booster',
  [62]: '',
  [63]: 'Power Treads',
  [64]: 'Hand of Midas Recipe',
  [65]: 'Hand of Midas',
  [66]: '',
  [67]: 'Oblivion Staff',
  [68]: '',
  [69]: 'Perseverance',
  [70]: '',
  [71]: 'Poor Man\'s Shield',
  [72]: 'Bracer Recipe',
  [73]: 'Bracer',
  [74]: 'Wraith Band Recipe',
  [75]: 'Wraith Band',
  [76]: 'Null Talisman Recipe',
  [77]: 'Null Talisman',
  [78]: 'Mekansm Recipe',
  [79]: 'Mekansm',
  [80]: 'Vladmir\'s Offering Recipe',
  [81]: 'Vladmir\'s Offering',
  [84]: 'Flying Courier',
  [85]: 'Buckler Recipe',
  [86]: 'Buckler',
  [87]: 'Ring of Basilius Recipe',
  [88]: 'Ring of Basilius',
  [89]: 'Pipe of Insight Recipe',
  [90]: 'Pipe of Insight',
  [91]: 'Urn of Shadows Recipe',
  [92]: 'Urn of Shadows',
  [93]: 'Headdress Recipe',
  [94]: 'Headdress',
  [95]: '',
  [96]: 'Scythe of Vyse',
  [97]: 'Orchid Malevolence Recipe',
  [98]: 'Orchid Malevolence',
  [99]: 'Eul\'s Scepter Recipe',
  [100]: 'Eul\'s Scepter of Divinity',
  [101]: 'Force Staff Recipe',
  [102]: 'Force Staff',
  [103]: 'Dagon Recipe',
  [104]: 'Dagon',
  [105]: 'Necronomicon Recipe',
  [106]: 'Necronomicon',
  [107]: '',
  [108]: 'Aghanim\'s Scepter',
  [109]: 'Refresher Orb Recipe',
  [110]: 'Refresher Orb',
  [111]: 'Assault Cuirass Recipe',
  [112]: 'Assault Cuirass',
  [113]: 'Heart of Tarrasque Recipe',
  [114]: 'Heart of Tarrasque',
  [115]: 'Black King Bar Recipe',
  [116]: 'Black King Bar',
  [117]: 'Aegis of the Immortal',
  [118]: 'Shiva\'s Guard Recipe',
  [119]: 'Shiva\'s Guard',
  [120]: 'Bloodstone Recipe',
  [121]: 'Bloodstone',
  [122]: 'Linken\'s Sphere Recipe',
  [123]: 'Linken\'s Sphere',
  [124]: '',
  [125]: 'Vanguard',
  [126]: 'Blade Mail Recipe',
  [127]: 'Blade Mail',
  [128]: '',
  [129]: 'Soul Booster',
  [130]: '',
  [131]: 'Hood of Defiance',
  [132]: '',
  [133]: 'Divine Rapier',
  [134]: 'Monkey King Bar Recipe',
  [135]: 'Monkey King Bar',
  [136]: 'Radiance Recipe',
  [137]: 'Radiance',
  [138]: '',
  [139]: 'Butterfly',
  [140]: 'Daedalus Recipe',
  [141]: 'Daedalus',
  [142]: 'Skull Basher Recipe',
  [143]: 'Skull Basher',
  [144]: 'Battle Fury Recipe',
  [145]: 'Battle Fury',
  [146]: 'Manta Style Recipe',
  [147]: 'Manta Style',
  [148]: 'Crystalys Recipe',
  [149]: 'Crystalys',
  [150]: 'Armlet of Mordiggian Recipe',
  [151]: 'Armlet of Mordiggian',
  [152]: 'Shadow Blade',
  [153]: '',
  [154]: 'Sange and Yasha',
  [155]: 'Satanic Recipe',
  [156]: 'Satanic',
  [157]: 'Mjollnir Recipe',
  [158]: 'Mjollnir',
  [159]: '',
  [160]: 'Eye of Skadi',
  [161]: 'Sange Recipe',
  [162]: 'Sange',
  [163]: 'Helm of the Dominator Recipe',
  [164]: 'Helm of the Dominator',
  [165]: 'Maelstrom Recipe',
  [166]: 'Maelstrom',
  [167]: '',
  [168]: 'Desolator',
  [169]: 'Yasha Recipe',
  [170]: 'Yasha',
  [171]: 'Mask of Madness Recipe',
  [172]: 'Mask of Madness',
  [173]: 'Diffusal Blade Recipe',
  [174]: 'Diffusal Blade',
  [175]: 'Ethereal Blade Recipe',
  [176]: 'Ethereal Blade',
  [177]: 'Soul Ring Recipe',
  [178]: 'Soul Ring',
  [179]: '',
  [180]: 'Arcane Boots',
  [181]: 'Orb of Venom',
  [182]: 'Stout Shield',
  [183]: '',
  [184]: 'Drum of Endurance Recipe',
  [185]: 'Drum of Endurance',
  [186]: '',
  [187]: 'Medallion of Courage',
  [188]: 'Smoke of Deceit',
  [189]: 'Veil of Discord Recipe',
  [190]: 'Veil of Discord',
  [191]: '',
  [192]: '',
  [193]: 'Necronomicon',
  [194]: 'Necronomicon',
  [195]: 'Recipe: Diffusal Blade (level 2)',
  [196]: 'Diffusal Blade (level 2)',
  [197]: '',
  [198]: '',
  [199]: '',
  [200]: '',
  [201]: 'Dagon',
  [202]: 'Dagon',
  [203]: 'Dagon',
  [204]: 'Dagon',
  [205]: 'Rod of Atos Recipe',
  [206]: 'Rod of Atos',
  [207]: 'Abyssal Blade Recipe',
  [208]: 'Abyssal Blade',
  [209]: 'Heaven\'s Halberd Recipe',
  [210]: 'Heaven\'s Halberd',
  [211]: '',
  [212]: 'Ring of Aquila',
  [213]: 'Tranquil Boots Recipe',
  [214]: 'Tranquil Boots',
  [215]: 'Shadow Amulet',
  [216]: 'Enchanted Mango',
  [217]: '',
  [218]: 'Observer and Sentry Wards',
  [219]: '',
  [220]: 'Boots of Travel 2',
  [221]: 'Lotus Orb Recipe',
  [222]: 'Meteor Hammer Recipe',
  [223]: 'Meteor Hammer',
  [224]: 'Nullifier Recipe',
  [225]: 'Nullifier',
  [226]: 'Lotus Orb',
  [227]: 'Solar Crest Recipe',
  [228]: 'Octarine Core Recipe',
  [229]: 'Solar Crest',
  [230]: 'Guardian Greaves Recipe',
  [231]: 'Guardian Greaves',
  [232]: 'Aether Lens',
  [233]: 'Aether Lens Recipe',
  [234]: 'Dragon Lance Recipe',
  [235]: 'Octarine Core',
  [236]: 'Dragon Lance',
  [237]: 'Faerie Fire',
  [238]: 'Iron Talon Recipe',
  [239]: 'Iron Talon',
  [240]: 'Blight Stone',
  [241]: 'Tango (Shared)',
  [242]: 'Crimson Guard',
  [243]: 'Crimson Guard Recipe',
  [244]: 'Wind Lace',
  [245]: 'Bloodthorn Recipe',
  [246]: '',
  [247]: 'Moon Shard',
  [248]: 'Silver Edge Recipe',
  [249]: 'Silver Edge',
  [250]: 'Bloodthorn',
  [251]: '',
  [252]: 'Echo Sabre',
  [253]: 'Glimmer Cape Recipe',
  [254]: 'Glimmer Cape',
  [255]: 'Aeon Disk Recipe',
  [256]: 'Aeon Disk',
  [257]: 'Tome of Knowledge',
  [258]: 'Kaya Recipe',
  [259]: 'Kaya',
  [260]: 'Refresher Shard',
  [261]: 'Crown',
  [262]: 'Hurricane Pike Recipe',
  [263]: 'Hurricane Pike',
  [265]: 'Infused Raindrops',
  [266]: 'Spirit Vessel Recipe',
  [267]: 'Spirit Vessel',
  [268]: 'Holy Locket Recipe',
  [269]: 'Holy Locket',
  [270]: 'Aghanim\'s Blessing Recipe',
  [271]: 'Aghanim\'s Blessing',
  [272]: 'Kaya and Sange Recipe',
  [273]: 'Kaya and Sange',
  [274]: 'Yasha and Kaya Recipe',
  [275]: 'Trident Recipe',
  [276]: '',
  [277]: 'Yasha and Kaya',
  [279]: 'Ring of Tarrasque',
  [286]: 'Flying Courier',
  [287]: 'Keen Optic',
  [288]: 'Grove Bow',
  [289]: 'Quickening Charm',
  [290]: 'Philosopher\'s Stone',
  [291]: 'Force Boots',
  [292]: 'Stygian Desolator',
  [293]: 'Phoenix Ash',
  [294]: 'Seer Stone',
  [295]: 'Greater Mango',
  [297]: 'Vampire Fangs',
  [298]: 'Craggy Coat',
  [299]: 'Greater Faerie Fire',
  [300]: 'Timeless Relic',
  [301]: 'Mirror Shield',
  [302]: 'Elixir',
  [303]: 'Ironwood Tree Recipe',
  [304]: 'Ironwood Tree',
  [305]: 'Royal Jelly',
  [306]: 'Pupil\'s Gift',
  [307]: 'Tome of Aghanim',
  [308]: 'Repair Kit',
  [309]: 'Mind Breaker',
  [310]: 'Third Eye',
  [311]: 'Spell Prism',
  [312]: 'Horizon',
  [313]: 'Fusion Rune',
  [317]: 'Recipe: Fallen Sky',
  [325]: 'Prince\'s Knife',
  [326]: 'Spider Legs',
  [327]: 'Helm of the Undying',
  [328]: 'Mango Tree',
  [329]: 'Vambrace Recipe',
  [330]: 'Witless Shako',
  [331]: 'Vambrace',
  [334]: 'Imp Claw',
  [335]: 'Flicker',
  [336]: 'Telescope',
  [349]: 'Arcane Ring',
  [354]: 'Ocean Heart',
  [355]: 'Broom Handle',
  [356]: 'Trusty Shovel',
  [357]: 'Nether Shawl',
  [358]: 'Dragon Scale',
  [359]: 'Essence Ring',
  [360]: 'Clumsy Net',
  [361]: 'Enchanted Quiver',
  [362]: 'Ninja Gear',
  [363]: 'Illusionist\'s Cape',
  [364]: 'Havoc Hammer',
  [365]: 'Magic Lamp',
  [366]: 'Apex',
  [367]: 'Ballista',
  [368]: 'Woodland Striders',
  [370]: 'Book of the Dead',
  [371]: 'Fallen Sky',
  [372]: 'Pirate Hat',
  [373]: 'Dimensional Doorway',
  [374]: 'Ex Machina',
  [375]: 'Faded Broach',
  [376]: 'Paladin Sword',
  [377]: 'Minotaur Horn',
  [378]: 'Orb of Destruction',
  [379]: 'The Leveller',
  [381]: 'Titan Sliver',
  [473]: 'Voodoo Mask',
  [485]: 'Blitz Knuckles',
  [533]: 'Witch Blade Recipe',
  [534]: 'Witch Blade',
  [565]: 'Chipped Vest',
  [566]: 'Wizard Glass',
  [569]: 'Orb of Corrosion',
  [570]: 'Gloves of Travel',
  [571]: 'Trickster Cloak',
  [573]: 'Elven Tunic',
  [574]: 'Cloak of Flames',
  [575]: 'Venom Gland',
  [576]: 'Helm of the Gladiator',
  [577]: 'Possessed Mask',
  [578]: 'Ancient Perseverance',
  [582]: 'Oakheart',
  [585]: 'Stormcrafter',
  [588]: 'Overflowing Elixir',
  [589]: 'Fairy\'s Trinket',
  [593]: 'Fluffy Hat',
  [596]: 'Falcon Blade',
  [597]: 'Mage Slayer Recipe',
  [598]: 'Mage Slayer',
  [599]: 'Falcon Blade Recipe',
  [600]: 'Overwhelming Blink',
  [603]: 'Swift Blink',
  [604]: 'Arcane Blink',
  [606]: 'Arcane Blink Recipe',
  [607]: 'Swift Blink Recipe',
  [608]: 'Overwhelming Blink Recipe',
  [609]: 'Aghanim\'s Shard',
  [610]: 'Wind Waker',
  [612]: 'Wind Waker Recipe',
  [633]: 'Helm of the Overlord Recipe',
  [635]: 'Helm of the Overlord',
  [637]: 'Star Mace',
  [638]: 'Penta-Edged Sword',
  [640]: 'Orb of Corrosion Recipe',
  [653]: '',
  [655]: 'Grandmaster\'s Glaive',
  [674]: 'Warhammer',
  [675]: 'Psychic Headband',
  [676]: 'Ceremonial Robe',
  [677]: 'Book of Shadows',
  [678]: 'Giant\'s Ring',
  [679]: 'Shadow of Vengeance',
  [680]: 'Bullwhip',
  [686]: 'Quicksilver Amulet',
  [691]: 'Eternal Shroud Recipe',
  [692]: 'Eternal Shroud',
  [725]: 'Aghanim\'s Shard - Roshan',
  [727]: 'Aghanim\'s Blessing - Roshan',
  [731]: 'Satchel',
  [824]: 'Assassin\'s Dagger',
  [825]: 'Ascetic\'s Cap',
  [826]: 'Assassin\'s Contract',
  [827]: 'Icarus Wings',
  [828]: 'Brigand\'s Blade',
  [829]: 'Arcanist\'s Armor',
  [833]: 'Bruiser\'s Maul Recipe',
  [834]: 'Blast Rig',
  [835]: 'Fae Grenade',
  [836]: 'Light Robes',
  [837]: 'Witchbane',
  [838]: 'Pig Pole',
  [839]: 'Ring of Fortitude',
  [840]: 'Tumbler\'s Toy',
  [849]: 'Mechanical Arm',
  [859]: 'Voidwalker Scythe Recipe',
  [904]: 'Voidwalker Scythe',
  [906]: 'Bruiser\'s Maul',
  [907]: 'Wraith Pact Recipe',
  [908]: 'Wraith Pact',
  [910]: 'Revenant\'s Brooch Recipe',
  [911]: 'Revenant\'s Brooch',
  [928]: '',
  [929]: 'Eagle Eye',
  [930]: 'Boots of Bearing Recipe',
  [931]: 'Boots of Bearing',
  [938]: '',
  [939]: 'Harpoon',
  [940]: 'Wand of the Brine',
  [945]: 'Seeds of Serenity',
  [946]: 'Lance of Pursuit',
  [947]: 'Occult Bracelet',
  [948]: '',
  [949]: 'Ogre Seal Totem',
  [950]: 'Defiant Shell',
  [964]: 'Diffusal Blade',
  [965]: '',
  [968]: '',
  [969]: '',
  [990]: 'Eye of the Vizier',
  [998]: '',
  [1000]: '',
  [1017]: '',
  [1021]: 'River Vial: Chrome',
  [1022]: 'River Vial: Dry',
  [1023]: 'River Vial: Slime',
  [1024]: 'River Vial: Oil',
  [1025]: 'River Vial: Electrified',
  [1026]: 'River Vial: Potion',
  [1027]: 'River Vial: Blood',
  [1028]: 'Tombstone',
  [1029]: 'Super Blink Dagger',
  [1030]: 'Pocket Tower',
  [1032]: 'Pocket Roshan',
  [1076]: 'Specialist\'s Array',
  [1077]: 'Dagger of Ristul',
  [1090]: 'Mercy & Grace',
  [1091]: 'Samurai Tabi',
  [1092]: 'Hermes Sandals Recipe',
  [1093]: 'Hermes Sandals',
  [1094]: 'Lunar Crest Recipe',
  [1095]: 'Lunar Crest',
  [1096]: 'Disperser Recipe',
  [1097]: 'Disperser',
  [1098]: 'Samurai Tabi Recipe',
  [1099]: 'Witches Switch Recipe',
  [1100]: 'Witches Switch',
  [1101]: 'Harpoon Recipe',
  [1106]: '',
  [1107]: 'Phylactery',
  [1122]: 'Diadem',
  [1123]: 'Blood Grenade',
  [1124]: 'Spark of Courage',
  [1125]: 'Cornucopia',
  [1127]: 'Pavise Recipe',
  [1128]: 'Pavise',
  [1154]: 'Block of Cheese',
  [1466]: 'Gleipnir',
  [1565]: 'Gleipnir Recipe',
  [2091]: 'Tier 1 Token',
  [2092]: 'Tier 2 Token',
  [2093]: 'Tier 3 Token',
  [2094]: 'Tier 4 Token',
  [2095]: 'Tier 5 Token',
  [2096]: 'Vindicator\'s Axe',
  [2097]: 'Duelist Gloves',
  [2098]: 'Horizon\'s Equilibrium',
  [2099]: 'Blighted Spirit',
  [2190]: 'Dandelion Amulet',
  [2191]: 'Turtle Shell',
  [2192]: 'Martyr\'s Plate',
  [2193]: 'Gossamer Cape',
  [4204]: 'Healing Lotus',
  [4205]: 'Great Healing Lotus',
  [4206]: 'Greater Healing Lotus',
  [4207]: '',
  [4208]: '',
  [4300]: 'Beloved Memory',
  [4301]: 'Scrying Shovel',
  [4302]: 'Forebearer\'s Fortune',
}

const ITEM_NAMES: IDotaItem = {
  [1]: 'item_blink',
  [2]: 'item_blades_of_attack',
  [3]: 'item_broadsword',
  [4]: 'item_chainmail',
  [5]: 'item_claymore',
  [6]: 'item_helm_of_iron_will',
  [7]: 'item_javelin',
  [8]: 'item_mithril_hammer',
  [9]: 'item_platemail',
  [10]: 'item_quarterstaff',
  [11]: 'item_quelling_blade',
  [12]: 'item_ring_of_protection',
  [13]: 'item_gauntlets',
  [14]: 'item_slippers',
  [15]: 'item_mantle',
  [16]: 'item_branches',
  [17]: 'item_belt_of_strength',
  [18]: 'item_boots_of_elves',
  [19]: 'item_robe',
  [20]: 'item_circlet',
  [21]: 'item_ogre_axe',
  [22]: 'item_blade_of_alacrity',
  [23]: 'item_staff_of_wizardry',
  [24]: 'item_ultimate_orb',
  [25]: 'item_gloves',
  [26]: 'item_lifesteal',
  [27]: 'item_ring_of_regen',
  [28]: 'item_sobi_mask',
  [29]: 'item_boots',
  [30]: 'item_gem',
  [31]: 'item_cloak',
  [32]: 'item_talisman_of_evasion',
  [33]: 'item_cheese',
  [34]: 'item_magic_stick',
  [35]: 'item_recipe_magic_wand',
  [36]: 'item_magic_wand',
  [37]: 'item_ghost',
  [38]: 'item_clarity',
  [39]: 'item_flask',
  [40]: 'item_dust',
  [41]: 'item_bottle',
  [42]: 'item_ward_observer',
  [43]: 'item_ward_sentry',
  [44]: 'item_tango',
  [45]: 'item_courier',
  [46]: 'item_tpscroll',
  [47]: 'item_recipe_travel_boots',
  [48]: 'item_travel_boots',
  [49]: 'item_recipe_phase_boots',
  [50]: 'item_phase_boots',
  [51]: 'item_demon_edge',
  [52]: 'item_eagle',
  [53]: 'item_reaver',
  [54]: 'item_relic',
  [55]: 'item_hyperstone',
  [56]: 'item_ring_of_health',
  [57]: 'item_void_stone',
  [58]: 'item_mystic_staff',
  [59]: 'item_energy_booster',
  [60]: 'item_point_booster',
  [61]: 'item_vitality_booster',
  [62]: 'item_recipe_power_treads',
  [63]: 'item_power_treads',
  [64]: 'item_recipe_hand_of_midas',
  [65]: 'item_hand_of_midas',
  [66]: 'item_recipe_oblivion_staff',
  [67]: 'item_oblivion_staff',
  [68]: 'item_recipe_pers',
  [69]: 'item_pers',
  [70]: 'item_recipe_poor_mans_shield',
  [71]: 'item_poor_mans_shield',
  [72]: 'item_recipe_bracer',
  [73]: 'item_bracer',
  [74]: 'item_recipe_wraith_band',
  [75]: 'item_wraith_band',
  [76]: 'item_recipe_null_talisman',
  [77]: 'item_null_talisman',
  [78]: 'item_recipe_mekansm',
  [79]: 'item_mekansm',
  [80]: 'item_recipe_vladmir',
  [81]: 'item_vladmir',
  [84]: 'item_flying_courier',
  [85]: 'item_recipe_buckler',
  [86]: 'item_buckler',
  [87]: 'item_recipe_ring_of_basilius',
  [88]: 'item_ring_of_basilius',
  [89]: 'item_recipe_pipe',
  [90]: 'item_pipe',
  [91]: 'item_recipe_urn_of_shadows',
  [92]: 'item_urn_of_shadows',
  [93]: 'item_recipe_headdress',
  [94]: 'item_headdress',
  [95]: 'item_recipe_sheepstick',
  [96]: 'item_sheepstick',
  [97]: 'item_recipe_orchid',
  [98]: 'item_orchid',
  [99]: 'item_recipe_cyclone',
  [100]: 'item_cyclone',
  [101]: 'item_recipe_force_staff',
  [102]: 'item_force_staff',
  [103]: 'item_recipe_dagon',
  [104]: 'item_dagon',
  [105]: 'item_recipe_necronomicon',
  [106]: 'item_necronomicon',
  [107]: 'item_recipe_ultimate_scepter',
  [108]: 'item_ultimate_scepter',
  [109]: 'item_recipe_refresher',
  [110]: 'item_refresher',
  [111]: 'item_recipe_assault',
  [112]: 'item_assault',
  [113]: 'item_recipe_heart',
  [114]: 'item_heart',
  [115]: 'item_recipe_black_king_bar',
  [116]: 'item_black_king_bar',
  [117]: 'item_aegis',
  [118]: 'item_recipe_shivas_guard',
  [119]: 'item_shivas_guard',
  [120]: 'item_recipe_bloodstone',
  [121]: 'item_bloodstone',
  [122]: 'item_recipe_sphere',
  [123]: 'item_sphere',
  [124]: 'item_recipe_vanguard',
  [125]: 'item_vanguard',
  [126]: 'item_recipe_blade_mail',
  [127]: 'item_blade_mail',
  [128]: 'item_recipe_soul_booster',
  [129]: 'item_soul_booster',
  [130]: 'item_recipe_hood_of_defiance',
  [131]: 'item_hood_of_defiance',
  [132]: 'item_recipe_rapier',
  [133]: 'item_rapier',
  [134]: 'item_recipe_monkey_king_bar',
  [135]: 'item_monkey_king_bar',
  [136]: 'item_recipe_radiance',
  [137]: 'item_radiance',
  [138]: 'item_recipe_butterfly',
  [139]: 'item_butterfly',
  [140]: 'item_recipe_greater_crit',
  [141]: 'item_greater_crit',
  [142]: 'item_recipe_basher',
  [143]: 'item_basher',
  [144]: 'item_recipe_bfury',
  [145]: 'item_bfury',
  [146]: 'item_recipe_manta',
  [147]: 'item_manta',
  [148]: 'item_recipe_lesser_crit',
  [149]: 'item_lesser_crit',
  [150]: 'item_recipe_armlet',
  [151]: 'item_armlet',
  [152]: 'item_invis_sword',
  [153]: 'item_recipe_sange_and_yasha',
  [154]: 'item_sange_and_yasha',
  [155]: 'item_recipe_satanic',
  [156]: 'item_satanic',
  [157]: 'item_recipe_mjollnir',
  [158]: 'item_mjollnir',
  [159]: 'item_recipe_skadi',
  [160]: 'item_skadi',
  [161]: 'item_recipe_sange',
  [162]: 'item_sange',
  [163]: 'item_recipe_helm_of_the_dominator',
  [164]: 'item_helm_of_the_dominator',
  [165]: 'item_recipe_maelstrom',
  [166]: 'item_maelstrom',
  [167]: 'item_recipe_desolator',
  [168]: 'item_desolator',
  [169]: 'item_recipe_yasha',
  [170]: 'item_yasha',
  [171]: 'item_recipe_mask_of_madness',
  [172]: 'item_mask_of_madness',
  [173]: 'item_recipe_diffusal_blade',
  [174]: 'item_diffusal_blade',
  [175]: 'item_recipe_ethereal_blade',
  [176]: 'item_ethereal_blade',
  [177]: 'item_recipe_soul_ring',
  [178]: 'item_soul_ring',
  [179]: 'item_recipe_arcane_boots',
  [180]: 'item_arcane_boots',
  [181]: 'item_orb_of_venom',
  [182]: 'item_stout_shield',
  [183]: 'item_recipe_invis_sword',
  [184]: 'item_recipe_ancient_janggo',
  [185]: 'item_ancient_janggo',
  [186]: 'item_recipe_medallion_of_courage',
  [187]: 'item_medallion_of_courage',
  [188]: 'item_smoke_of_deceit',
  [189]: 'item_recipe_veil_of_discord',
  [190]: 'item_veil_of_discord',
  [191]: 'item_recipe_necronomicon_2',
  [192]: 'item_recipe_necronomicon_3',
  [193]: 'item_necronomicon_2',
  [194]: 'item_necronomicon_3',
  [195]: 'item_recipe_diffusal_blade_2',
  [196]: 'item_diffusal_blade_2',
  [197]: 'item_recipe_dagon_2',
  [198]: 'item_recipe_dagon_3',
  [199]: 'item_recipe_dagon_4',
  [200]: 'item_recipe_dagon_5',
  [201]: 'item_dagon_2',
  [202]: 'item_dagon_3',
  [203]: 'item_dagon_4',
  [204]: 'item_dagon_5',
  [205]: 'item_recipe_rod_of_atos',
  [206]: 'item_rod_of_atos',
  [207]: 'item_recipe_abyssal_blade',
  [208]: 'item_abyssal_blade',
  [209]: 'item_recipe_heavens_halberd',
  [210]: 'item_heavens_halberd',
  [211]: 'item_recipe_ring_of_aquila',
  [212]: 'item_ring_of_aquila',
  [213]: 'item_recipe_tranquil_boots',
  [214]: 'item_tranquil_boots',
  [215]: 'item_shadow_amulet',
  [216]: 'item_enchanted_mango',
  [217]: 'item_recipe_ward_dispenser',
  [218]: 'item_ward_dispenser',
  [219]: 'item_recipe_travel_boots_2',
  [220]: 'item_travel_boots_2',
  [221]: 'item_recipe_lotus_orb',
  [222]: 'item_recipe_meteor_hammer',
  [223]: 'item_meteor_hammer',
  [224]: 'item_recipe_nullifier',
  [225]: 'item_nullifier',
  [226]: 'item_lotus_orb',
  [227]: 'item_recipe_solar_crest',
  [228]: 'item_recipe_octarine_core',
  [229]: 'item_solar_crest',
  [230]: 'item_recipe_guardian_greaves',
  [231]: 'item_guardian_greaves',
  [232]: 'item_aether_lens',
  [233]: 'item_recipe_aether_lens',
  [234]: 'item_recipe_dragon_lance',
  [235]: 'item_octarine_core',
  [236]: 'item_dragon_lance',
  [237]: 'item_faerie_fire',
  [238]: 'item_recipe_iron_talon',
  [239]: 'item_iron_talon',
  [240]: 'item_blight_stone',
  [241]: 'item_tango_single',
  [242]: 'item_crimson_guard',
  [243]: 'item_recipe_crimson_guard',
  [244]: 'item_wind_lace',
  [245]: 'item_recipe_bloodthorn',
  [246]: 'item_recipe_moon_shard',
  [247]: 'item_moon_shard',
  [248]: 'item_recipe_silver_edge',
  [249]: 'item_silver_edge',
  [250]: 'item_bloodthorn',
  [251]: 'item_recipe_echo_sabre',
  [252]: 'item_echo_sabre',
  [253]: 'item_recipe_glimmer_cape',
  [254]: 'item_glimmer_cape',
  [255]: 'item_recipe_aeon_disk',
  [256]: 'item_aeon_disk',
  [257]: 'item_tome_of_knowledge',
  [258]: 'item_recipe_kaya',
  [259]: 'item_kaya',
  [260]: 'item_refresher_shard',
  [261]: 'item_crown',
  [262]: 'item_recipe_hurricane_pike',
  [263]: 'item_hurricane_pike',
  [265]: 'item_infused_raindrop',
  [266]: 'item_recipe_spirit_vessel',
  [267]: 'item_spirit_vessel',
  [268]: 'item_recipe_holy_locket',
  [269]: 'item_holy_locket',
  [270]: 'item_recipe_ultimate_scepter_2',
  [271]: 'item_ultimate_scepter_2',
  [272]: 'item_recipe_kaya_and_sange',
  [273]: 'item_kaya_and_sange',
  [274]: 'item_recipe_yasha_and_kaya',
  [275]: 'item_recipe_trident',
  [276]: 'item_combo_breaker',
  [277]: 'item_yasha_and_kaya',
  [279]: 'item_ring_of_tarrasque',
  [286]: 'item_flying_courier',
  [287]: 'item_keen_optic',
  [288]: 'item_grove_bow',
  [289]: 'item_quickening_charm',
  [290]: 'item_philosophers_stone',
  [291]: 'item_force_boots',
  [292]: 'item_desolator_2',
  [293]: 'item_phoenix_ash',
  [294]: 'item_seer_stone',
  [295]: 'item_greater_mango',
  [297]: 'item_vampire_fangs',
  [298]: 'item_craggy_coat',
  [299]: 'item_greater_faerie_fire',
  [300]: 'item_timeless_relic',
  [301]: 'item_mirror_shield',
  [302]: 'item_elixer',
  [303]: 'item_recipe_ironwood_tree',
  [304]: 'item_ironwood_tree',
  [305]: 'item_royal_jelly',
  [306]: 'item_pupils_gift',
  [307]: 'item_tome_of_aghanim',
  [308]: 'item_repair_kit',
  [309]: 'item_mind_breaker',
  [310]: 'item_third_eye',
  [311]: 'item_spell_prism',
  [312]: 'item_horizon',
  [313]: 'item_fusion_rune',
  [317]: 'item_recipe_fallen_sky',
  [325]: 'item_princes_knife',
  [326]: 'item_spider_legs',
  [327]: 'item_helm_of_the_undying',
  [328]: 'item_mango_tree',
  [329]: 'item_recipe_vambrace',
  [330]: 'item_witless_shako',
  [331]: 'item_vambrace',
  [334]: 'item_imp_claw',
  [335]: 'item_flicker',
  [336]: 'item_spy_gadget',
  [349]: 'item_arcane_ring',
  [354]: 'item_ocean_heart',
  [355]: 'item_broom_handle',
  [356]: 'item_trusty_shovel',
  [357]: 'item_nether_shawl',
  [358]: 'item_dragon_scale',
  [359]: 'item_essence_ring',
  [360]: 'item_clumsy_net',
  [361]: 'item_enchanted_quiver',
  [362]: 'item_ninja_gear',
  [363]: 'item_illusionsts_cape',
  [364]: 'item_havoc_hammer',
  [365]: 'item_panic_button',
  [366]: 'item_apex',
  [367]: 'item_ballista',
  [368]: 'item_woodland_striders',
  [370]: 'item_demonicon',
  [371]: 'item_fallen_sky',
  [372]: 'item_pirate_hat',
  [373]: 'item_dimensional_doorway',
  [374]: 'item_ex_machina',
  [375]: 'item_faded_broach',
  [376]: 'item_paladin_sword',
  [377]: 'item_minotaur_horn',
  [378]: 'item_orb_of_destruction',
  [379]: 'item_the_leveller',
  [381]: 'item_titan_sliver',
  [473]: 'item_voodoo_mask',
  [485]: 'item_blitz_knuckles',
  [533]: 'item_recipe_witch_blade',
  [534]: 'item_witch_blade',
  [565]: 'item_chipped_vest',
  [566]: 'item_wizard_glass',
  [569]: 'item_orb_of_corrosion',
  [570]: 'item_gloves_of_travel',
  [571]: 'item_trickster_cloak',
  [573]: 'item_elven_tunic',
  [574]: 'item_cloak_of_flames',
  [575]: 'item_venom_gland',
  [576]: 'item_gladiator_helm',
  [577]: 'item_possessed_mask',
  [578]: 'item_ancient_perseverance',
  [582]: 'item_oakheart',
  [585]: 'item_stormcrafter',
  [588]: 'item_overflowing_elixir',
  [589]: 'item_mysterious_hat',
  [593]: 'item_fluffy_hat',
  [596]: 'item_falcon_blade',
  [597]: 'item_recipe_mage_slayer',
  [598]: 'item_mage_slayer',
  [599]: 'item_recipe_falcon_blade',
  [600]: 'item_overwhelming_blink',
  [603]: 'item_swift_blink',
  [604]: 'item_arcane_blink',
  [606]: 'item_recipe_arcane_blink',
  [607]: 'item_recipe_swift_blink',
  [608]: 'item_recipe_overwhelming_blink',
  [609]: 'item_aghanims_shard',
  [610]: 'item_wind_waker',
  [612]: 'item_recipe_wind_waker',
  [633]: 'item_recipe_helm_of_the_overlord',
  [635]: 'item_helm_of_the_overlord',
  [637]: 'item_star_mace',
  [638]: 'item_penta_edged_sword',
  [640]: 'item_recipe_orb_of_corrosion',
  [653]: 'item_recipe_grandmasters_glaive',
  [655]: 'item_grandmasters_glaive',
  [674]: 'item_warhammer',
  [675]: 'item_psychic_headband',
  [676]: 'item_ceremonial_robe',
  [677]: 'item_book_of_shadows',
  [678]: 'item_giants_ring',
  [679]: 'item_vengeances_shadow',
  [680]: 'item_bullwhip',
  [686]: 'item_quicksilver_amulet',
  [691]: 'item_recipe_eternal_shroud',
  [692]: 'item_eternal_shroud',
  [725]: 'item_aghanims_shard_roshan',
  [727]: 'item_ultimate_scepter_roshan',
  [731]: 'item_satchel',
  [824]: 'item_assassins_dagger',
  [825]: 'item_ascetic_cap',
  [826]: 'item_sample_picker',
  [827]: 'item_icarus_wings',
  [828]: 'item_misericorde',
  [829]: 'item_force_field',
  [833]: 'item_recipe_tenderizer',
  [834]: 'item_black_powder_bag',
  [835]: 'item_paintball',
  [836]: 'item_light_robes',
  [837]: 'item_heavy_blade',
  [838]: 'item_unstable_wand',
  [839]: 'item_fortitude_ring',
  [840]: 'item_pogo_stick',
  [849]: 'item_mechanical_arm',
  [859]: 'item_recipe_voidwalker_scythe',
  [904]: 'item_voidwalker_scythe',
  [906]: 'item_tenderizer',
  [907]: 'item_recipe_wraith_pact',
  [908]: 'item_wraith_pact',
  [910]: 'item_recipe_revenants_brooch',
  [911]: 'item_revenants_brooch',
  [928]: 'item_recipe_eagle_eye',
  [929]: 'item_eagle_eye',
  [930]: 'item_recipe_boots_of_bearing',
  [931]: 'item_boots_of_bearing',
  [938]: 'item_slime_vial',
  [939]: 'item_harpoon',
  [940]: 'item_wand_of_the_brine',
  [945]: 'item_seeds_of_serenity',
  [946]: 'item_lance_of_pursuit',
  [947]: 'item_occult_bracelet',
  [948]: 'item_tome_of_omniscience',
  [949]: 'item_ogre_seal_totem',
  [950]: 'item_defiant_shell',
  [964]: 'item_diffusal_blade_2',
  [965]: 'item_recipe_diffusal_blade_2',
  [968]: 'item_arcane_scout',
  [969]: 'item_barricade',
  [990]: 'item_eye_of_the_vizier',
  [998]: 'item_manacles_of_power',
  [1000]: 'item_bottomless_chalice',
  [1017]: 'item_wand_of_sanctitude',
  [1021]: 'item_river_painter',
  [1022]: 'item_river_painter2',
  [1023]: 'item_river_painter3',
  [1024]: 'item_river_painter4',
  [1025]: 'item_river_painter5',
  [1026]: 'item_river_painter6',
  [1027]: 'item_river_painter7',
  [1028]: 'item_mutation_tombstone',
  [1029]: 'item_super_blink',
  [1030]: 'item_pocket_tower',
  [1032]: 'item_pocket_roshan',
  [1076]: 'item_specialists_array',
  [1077]: 'item_dagger_of_ristul',
  [1090]: 'item_muertas_gun',
  [1091]: 'item_samurai_tabi',
  [1092]: 'item_recipe_hermes_sandals',
  [1093]: 'item_hermes_sandals',
  [1094]: 'item_recipe_lunar_crest',
  [1095]: 'item_lunar_crest',
  [1096]: 'item_recipe_disperser',
  [1097]: 'item_disperser',
  [1098]: 'item_recipe_samurai_tabi',
  [1099]: 'item_recipe_witches_switch',
  [1100]: 'item_witches_switch',
  [1101]: 'item_recipe_harpoon',
  [1106]: 'item_recipe_phylactery',
  [1107]: 'item_phylactery',
  [1122]: 'item_diadem',
  [1123]: 'item_blood_grenade',
  [1124]: 'item_spark_of_courage',
  [1125]: 'item_cornucopia',
  [1127]: 'item_recipe_pavise',
  [1128]: 'item_pavise',
  [1154]: 'item_royale_with_cheese',
  [1466]: 'item_gungir',
  [1565]: 'item_recipe_gungir',
  [2091]: 'item_tier1_token',
  [2092]: 'item_tier2_token',
  [2093]: 'item_tier3_token',
  [2094]: 'item_tier4_token',
  [2095]: 'item_tier5_token',
  [2096]: 'item_vindicators_axe',
  [2097]: 'item_duelist_gloves',
  [2098]: 'item_horizons_equilibrium',
  [2099]: 'item_blighted_spirit',
  [2190]: 'item_dandelion_amulet',
  [2191]: 'item_turtle_shell',
  [2192]: 'item_martyrs_plate',
  [2193]: 'item_gossamer_cape',
  [4204]: 'item_famango',
  [4205]: 'item_great_famango',
  [4206]: 'item_greater_famango',
  [4207]: 'item_recipe_great_famango',
  [4208]: 'item_recipe_greater_famango',
  [4300]: 'item_ofrenda',
  [4301]: 'item_ofrenda_shovel',
  [4302]: 'item_ofrenda_pledge',
}

const BLACKLIST_ITEMS = [
  'Town Portal Scroll',
  'Healing Lotus',
  'Great Healing Lotus',
  'Greater Healing Lotus'
]
//#endregion Dota Constants

//#region Constants
const BG_PATH  = 'src/commands/dota2/image/bg.jpg'
const INV_PATH = 'src/commands/dota2/image/inv.png'
const GOLD_PATH = 'src/commands/dota2/image/gold.png'
const ENDPOINT = 'https://api.stratz.com/graphql'
const graphQLClient = new GraphQLClient(ENDPOINT, { headers: { authorization: `Bearer ${process.env.stratz}` }})
const DOTA_ITEM_IMAGE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/'
const DOTA_ABILITY_IMAGE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/'
const DOTA_TALENT_TREE_IMAGE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg'
const DOTA_RUNE_IMAGE = 'https://cdn.stratz.com/images/dota2/runes/'
//#endregion Constants

//#region Command
export default {
//#region Command data
  name: 'hero',
  description: 'IB&SB',
  options: [
    {
      name: 'hero',
      description: 'The hero id. You can it get using the /get-heroes command',
      type: 'INTEGER',
      required: true,
    },
    {
      name: 'position',
      description: 'position',
      type: 'STRING',
      required: true,
      choices: [
        { name: 'Carry',        value: 'POSITION_1'},
        { name: 'Mid',          value: 'POSITION_2'},
        { name: 'Offlane',      value: 'POSITION_3'},
        { name: 'Soft Support', value: 'POSITION_4'},
        { name: 'Hard Support', value: 'POSITION_5'},
      ]
    },
    {
      name: 'with-hero',
      description: 'The hero id to include in this query',
      type: 'INTEGER',
      required: false,
    },
    {
      name: 'against-hero',
      description: 'The hero id to include in this query',
      type: 'INTEGER',
      required: false,
    },
    {
      name: 'is-pro',
      description: 'Determines that the query require the results come with a player that is qualified as a Pro',
      type: 'BOOLEAN',
      required: false,
    },
    {
      name: 'skip',
      description: 'The amount of data to skip before collecting your query',
      type: 'INTEGER',
      required: false,
    },
  ],
  guilds: ['1150427580734906368'],
  isOwnerOnly: true,
  // cooldown: '1m',
//#endregion Command data
  callback: async (interaction) => {
//#region Init
    await interaction.deferReply({ ephemeral: true })
    if (!existsSync(join(__dirname, 'image/'))) mkdirSync(join(__dirname, 'image/'))

    const hero        = interaction.options.get('hero')?.value as number
    const pos         = interaction.options.get('position')?.value as string
    const withHero    = interaction.options.get('with-hero')?.value as number
    const againstHero = interaction.options.get('against-hero')?.value as number
    const isPro       = interaction.options.get('is-pro')?.value as boolean
    const skip        = interaction.options.get('skip')?.value as number ?? 0

    if (!HEROES[hero]) {
      await interaction.editReply({ content: '<:poel:1168156790245040169>' })
      return
    }

    const heroIcon    = `https://cdn.stratz.com/images/dota2/heroes/${NPCS[hero]}_vert.png`
    const heroImg     = `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${NPCS[hero]}.png`

    if (withHero && !HEROES[withHero]) {
      await interaction.editReply({ content: '<:poel:1168156790245040169>' })
      return
    }

    if (againstHero && !HEROES[againstHero]) {
      await interaction.editReply({ content: '<:poel:1168156790245040169>' })
      return
    }

    let HERO_GUIDE_ARGS = `heroId: ${hero}, positionId: ${pos}`
    if (withHero) HERO_GUIDE_ARGS    += `, withHeroId: ${withHero}`
    if (againstHero) HERO_GUIDE_ARGS += `, againstHeroId: ${againstHero}`
    if (isPro) HERO_GUIDE_ARGS       += `, isPro: ${isPro}`

    const MAIN_GQL = gql`{ heroStats { guide(${HERO_GUIDE_ARGS}) { matchCount guides(take: 1, skip: ${skip}) { steamAccountId }}}}`
    const MAIN_DATA: any = await graphQLClient.request(MAIN_GQL)

    if (MAIN_DATA.heroStats.guide.length <= 0) {
      await interaction.editReply({ content: `<:poel:1168156790245040169>` })
      return
    }

    if (MAIN_DATA.heroStats.guide[0].guides === null) {
      await interaction.editReply({ content: '<:poel:1168156790245040169>' })
      return
    }

    const steamId = MAIN_DATA.heroStats.guide[0].guides[0].steamAccountId
    const HERO_GUIDE_GQL = gql`{ heroStats { guide(${HERO_GUIDE_ARGS}) { guides(take: 1, skip: ${skip}) { match { durationSeconds id players(steamAccountId: ${steamId}) { kills deaths assists imp goldPerMinute experiencePerMinute numLastHits numDenies heroDamage towerDamage heroHealing playbackData { runeEvents { time rune action } playerUpdateGoldEvents { time networth } itemUsedEvents { time itemId attacker target} healEvents { time byItem} inventoryEvents { time item0 { itemId charges } item1 { itemId charges } item2 { itemId charges } item3 { itemId charges } item4 { itemId charges } item5 { itemId charges }} purchaseEvents { time itemId }}}}}}}}`
    const HERO_GUIDE_DATA: any = await graphQLClient.request(HERO_GUIDE_GQL)

    const playerData = HERO_GUIDE_DATA.heroStats.guide[0].guides[0].match.players[0]
    const matchData = HERO_GUIDE_DATA.heroStats.guide[0].guides[0].match
//#endregion Init

//#region generalStatisticsPage
    const generalStatisticsPage = new EmbedBuilder()
      .setColor('DarkPurple')
      .setFooter({ text: `Data provided by STRATZ.com`, iconURL: `https://stratz.com/images/stratz_knowledge_graph_logo.png` })
      .setTitle(`Guide for ${HEROES[hero]}`)
      .setThumbnail(heroIcon)
      .setDescription('General statistics')
      .setImage(heroImg)
      .addFields(
        { name: 'KDA',      value: `${playerData.kills}/${playerData.deaths}/${playerData.assists}`, inline: true},
        { name: 'GPMXPM',   value: `${playerData.goldPerMinute}/${playerData.experiencePerMinute}`, inline: true },
        { name: 'LH/DN',    value: `${playerData.numLastHits}/${playerData.numDenies}`, inline: true },
        { name: 'HeroDmg',  value: `${playerData.heroDamage}`, inline: true },
        { name: 'TowerDmg', value: `${playerData.towerDamage}`, inline: true },
        { name: 'Healing',  value: `${playerData.heroHealing}`, inline: true },
        { name: 'Playtime', value: `${formatTime(matchData.durationSeconds)}`, inline: true },
        { name: 'Impact',   value: `${playerData.imp}`, inline: true },
        { name: 'Match',    value: `[Click me](https://stratz.com/matches/${matchData.id})`, inline: true }
      )
//#endregion generalStatisticsPage

//#region itemBuildEarlyPage
    const starting_items_index = indexOfMinNegativeValue(playerData.playbackData.inventoryEvents)
    let consumables: IDotaItemCons = {}
    for (let i = 0; i < Object.entries(playerData.playbackData.healEvents).length; i++) {
      const minutes = parseInt(formatTime(playerData.playbackData.healEvents[i].time).split(':')[0], 10)
      if (minutes < 10) {
        if (consumables[`${playerData.playbackData.healEvents[i].byItem}`] === undefined) consumables[`${playerData.playbackData.healEvents[i].byItem}`] = 1
        else consumables[`${playerData.playbackData.healEvents[i].byItem}`]++
      } else {
        break
      }
    }
    for (let i = 0; i < Object.entries(playerData.playbackData.itemUsedEvents).length; i++) {
      const minutes = parseInt(formatTime(playerData.playbackData.itemUsedEvents[i].time).split(':')[0], 10)
      if (minutes < 10) {
        if (playerData.playbackData.itemUsedEvents[i].attacker != playerData.playbackData.itemUsedEvents[i].target) continue
        if (playerData.playbackData.itemUsedEvents[i].itemId == '38' || playerData.playbackData.itemUsedEvents[i].itemId == '216') {
          if (consumables[`${playerData.playbackData.itemUsedEvents[i].itemId}`] === undefined) consumables[`${playerData.playbackData.itemUsedEvents[i].itemId}`] = 1
          else consumables[`${playerData.playbackData.itemUsedEvents[i].itemId}`]++
        } else {
          break
        }
      } else {
        break
      }
    }

    let items10: IDotaItem = {}
    let networth10 = ''
    for (let i = 0; i < Object.entries(playerData.playbackData.inventoryEvents).length; i++) {
      const minutes = parseInt(formatTime(playerData.playbackData.inventoryEvents[i].time).split(':')[0], 10)
      if (minutes < 10) {} else {
        for (const id in playerData.playbackData.inventoryEvents[i]) {
          if (playerData.playbackData.inventoryEvents[i].hasOwnProperty(id) && id !== 'time') {
            const value: any = playerData.playbackData.inventoryEvents[i][id]
            if (value !== null) items10[`${id}`] = `${ITEM_NAMES[value.itemId]}`
          }
        }
        break
      }
    }
    for (let i = 0; i < Object.entries(playerData.playbackData.playerUpdateGoldEvents).length; i++) {
      const minutes = parseInt(formatTime(playerData.playbackData.playerUpdateGoldEvents[i].time).split(':')[0], 10)
      if (minutes < 10) {} else {
        networth10 = playerData.playbackData.playerUpdateGoldEvents[i].networth
        break
      }
    }

    let runes: IDotaItemCons = {}
    for (let i = 0; i < Object.entries(playerData.playbackData.runeEvents).length; i++) {
      const minutes = parseInt(formatTime(playerData.playbackData.runeEvents[i].time).split(':')[0], 10)
      if (minutes < 10) {
        if (playerData.playbackData.runeEvents[i].action == 'PICKUP') {
          if (runes[`${String(playerData.playbackData.runeEvents[i].rune).toLowerCase()}`] == undefined) runes[`${String(playerData.playbackData.runeEvents[i].rune).toLowerCase()}`] = 1
          else runes[`${String(playerData.playbackData.runeEvents[i].rune).toLowerCase()}`]++
        }
      } else {
        break
      }
    }

    const ibegFilePath = join(__dirname, `image/${interaction.id}.png`)
    await generateItemBuildEarlyGameImage(`Early Game and Laning for ${HEROES[hero]}`, 'Starting items', 'Regen', consumables, playerData.playbackData.inventoryEvents[starting_items_index], 'Items at 10 minute', items10, networth10, 'Runes', runes, ibegFilePath)
    // const ibegUrl = await uploadToImgur(`${process.env.imgur}`, ibegFilePath)
    const itemBuildEarlyPage = new EmbedBuilder()
      .setColor('DarkPurple')
      .setFooter({ text: `Data provided by STRATZ.com`, iconURL: `https://stratz.com/images/stratz_knowledge_graph_logo.png` })
      .setTitle(`Guide for ${HEROES[hero]}`)
      .setThumbnail(heroIcon)
      .setDescription(`Item Build Early Game for ${HEROES[hero]}`)
      // .setImage(ibegUrl)
//#endregion itemBuildEarlyPage

//#region Pagination
    const embeds: EmbedBuilder[] = []
    embeds.push(generalStatisticsPage, itemBuildEarlyPage)

    const pages = {} as { [key: string]: number }

    const getRow = (id: string) => {
      const row = new ActionRowBuilder()

      row.addComponents(
        new ButtonBuilder()
          .setCustomId('prev_embed')
          .setStyle(ButtonStyle.Secondary)
          .setLabel('◀️')
          .setDisabled(pages[id] === 0)
      )

      row.addComponents(
        new ButtonBuilder()
          .setCustomId('next_embed')
          .setStyle(ButtonStyle.Secondary)
          .setLabel('▶️')
          .setDisabled(pages[id] === embeds.length - 1)
      )

      return row
    }

    const id = interaction.user.id
    pages[id] = pages[id] || 0

    const embed = embeds[pages[id]]
    const filter = (i: Interaction) => i.user.id === interaction.user.id
    const time = 1000 * 60 * 5

    await interaction.editReply({
      embeds: [embed],
      components: [getRow(id) as any],
    })

    const collector = interaction.channel?.createMessageComponentCollector({ filter, time })
    if (!collector) return

    collector.on('collect', (button) => {
      if (!button) return
      if (button.message.interaction?.id != interaction.id) return

      button.deferUpdate()

      if (button.customId !== 'prev_embed' && button.customId !== 'next_embed') return

      if (button.customId === 'prev_embed' && pages[id] > 0) --pages[id]
      else if (button.customId === 'next_embed' && pages[id] < embeds.length - 1) ++pages[id]

      interaction.editReply({
        embeds: [embeds[pages[id]]],
        components: [getRow(id) as any]
      })
    })
//#endregion Pagination

//#region Remove some files
    unlinkSync(ibegFilePath)
//#endregion Remove some files
  },
} as SlashCommand
//#endregion Command