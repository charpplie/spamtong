import { SlashCommand } from '@/comx'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction } from 'discord.js'
import { gql, GraphQLClient } from 'graphql-request'
import { createCanvas, loadImage } from 'canvas'
import { writeFileSync, readFileSync, unlink, unlinkSync } from 'fs'
import axios from 'axios'
import { join } from 'path'

async function generateImageWithTextAndBackground(header: string, early: string, mid: string, late: string, backgroundPath: string, outputPath: string): Promise<void> {
  const canvas = createCanvas(800, 600)
  const context = canvas.getContext('2d')

  const background = await loadImage(backgroundPath)
  context.drawImage(background, 0, 0, canvas.width, canvas.height)

  context.font = '24px Arial'
  context.fillStyle = 'white'
  context.fillText(header, 225, 75)
  context.font = '18px Arial'
  context.fillText(early, 50, 125)
  context.fillText(mid, 300, 125)
  context.fillText(late, 550, 125)

  const buffer = canvas.toBuffer('image/png')
  writeFileSync(outputPath, buffer)
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
    console.error('Error uploading to Imgur:', error)
    throw error
  }
}

interface IDotaHeroes {
  [id: number]: string
}

const HEROES: IDotaHeroes = {
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

const NPCS: IDotaHeroes = {
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

interface IDotaItems {
  [id: number]: string
}

const ITEMS: IDotaItems = {
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

function formatTime(seconds: number): string {
  const minutes: number = Math.floor(seconds / 60)
  const remainingSeconds: number = seconds % 60

  const formattedMinutes: string = minutes < 10 ? `0${minutes}` : `${minutes}`
  const formattedSeconds: string = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`

  return `${formattedMinutes}:${formattedSeconds}`
}

interface IDotaItemsFormat {
  [time: string]: string
}

interface IGameStages {
  [stage: string]: IDotaItemsFormat
}

const BLACKLIST_ITEMS = [
  'Town Portal Scroll',
  'Healing Lotus',
  'Great Healing Lotus',
  'Greater Healing Lotus'
]

const BG_PATH = 'src/commands/dota2/bg.jpg'

export default {
  name: 'hero',
  description: 'IB&SB',
  options: [
    {
      name: 'hero',
      description: 'The hero id. You can it get using the /get-heroes command',
      type: 'INTEGER',
      required: true,
      minValue: 0,
      maxValue: 32767,
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
      minValue: 0,
      maxValue: 32767,
    },
    {
      name: 'against-hero',
      description: 'The hero id to include in this query',
      type: 'INTEGER',
      required: false,
      minValue: 0,
      maxValue: 32767,
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
      required: false
    }
  ],
  guilds: ['1150427580734906368'],
  // isOwnerOnly: true,
  cooldown: '1m',
  callback: async (interaction) => {
    await interaction.deferReply({ ephemeral: true })
    const msgId = interaction.id

    const ENDPOINT      = 'https://api.stratz.com/graphql'
    const graphQLClient = new GraphQLClient(ENDPOINT, { headers: { authorization: `Bearer ${process.env.stratz}` }})

    const heroId      = interaction.options.get('hero')?.value
    const pos         = interaction.options.get('position')?.value
    const withHero    = interaction.options.get('with-hero')?.value
    const againstHero = interaction.options.get('against-hero')?.value
    const isPro       = interaction.options.get('is-pro')?.value
    const skip        = interaction.options.get('skip')?.value ?? 0
    const heroIcon    = `https://cdn.stratz.com/images/dota2/heroes/${NPCS[heroId as number]}_vert.png`
    const heroGif     = `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${NPCS[heroId as number]}.png`

    if (!HEROES[heroId as number]) {
      await interaction.editReply({ content: '<:poel:1168156790245040169>' })
      return
    }

    let HERO_GUIDE_ARGS = `heroId: ${heroId}, positionId: ${pos}`
    if (withHero)     HERO_GUIDE_ARGS += `, withHeroId: ${withHero}`
    if (againstHero)  HERO_GUIDE_ARGS += `, againstHeroId: ${againstHero}`
    if (isPro)        HERO_GUIDE_ARGS += `, isPro: ${isPro}`

    const MC_ON_POS_GQL = gql`{ heroStats { guide(heroId: ${heroId}, positionId: ${pos}) { matchCount }}}`
    const MC_ON_POS_DATA: any = await graphQLClient.request(MC_ON_POS_GQL)
    if (MC_ON_POS_DATA.heroStats.guide.length <= 0) {
      await interaction.editReply({ content: `<:poel:1168156790245040169>` })
      return
    }

    const STEAM_ID_GQL = gql`{ heroStats { guide(${HERO_GUIDE_ARGS}) { guides(take: 1, skip: ${skip}) { steamAccountId }}}}`
    const STEAM_ID_DATA: any = await graphQLClient.request(STEAM_ID_GQL)
    if (STEAM_ID_DATA.heroStats.guide[0].guides === null) {
      await interaction.editReply({ content: '<:poel:1168156790245040169>' })
      return
    }

    const steamId = STEAM_ID_DATA.heroStats.guide[0].guides[0].steamAccountId
    const HERO_GUIDES_GQL = gql`{ heroStats { guide(${HERO_GUIDE_ARGS}) { guides(take: 1, skip: ${skip}) { match { durationSeconds id players(steamAccountId: ${steamId}) { position kills deaths assists imp goldPerMinute experiencePerMinute numLastHits numDenies heroDamage towerDamage heroHealing playbackData { purchaseEvents { time itemId }}}}}}}}`
    const HERO_GUIDES_DATA: any = await graphQLClient.request(HERO_GUIDES_GQL)

    let items: IGameStages = {
      early: {},
      mid: {},
      late: {}
    }
    for (let i = 0; i < HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].playbackData.purchaseEvents.length; i++) {
      const minutes = parseInt(formatTime(HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].playbackData.purchaseEvents[i].time).split(':')[0], 10)
      if (minutes < 10) {
        items.early[formatTime(HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].playbackData.purchaseEvents[i].time)] = ITEMS[HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].playbackData.purchaseEvents[i].itemId]
      } else if (minutes >= 10 && minutes < 30) {
        items.mid[formatTime(HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].playbackData.purchaseEvents[i].time)] = ITEMS[HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].playbackData.purchaseEvents[i].itemId]
      } else {
        items.late[formatTime(HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].playbackData.purchaseEvents[i].time)] = ITEMS[HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].playbackData.purchaseEvents[i].itemId]
      }
    }

    const embeds: EmbedBuilder[] = []
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

    const firstPage = new EmbedBuilder()
      .setColor('DarkPurple')
      .setFooter({ text: `Data provided by STRATZ.com`, iconURL: `https://stratz.com/images/stratz_knowledge_graph_logo.png` })
      .setTitle(`Guide for ${HEROES[heroId as number]}`)
      .setThumbnail(`${heroIcon}`)
      .setDescription('General statistics')
      .addFields(
        { name: 'KDA', value: `${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].kills}/${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].deaths}/${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].assists}`, inline: true},
        { name: 'GPMXPM', value: `${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].goldPerMinute}/${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].experiencePerMinute}`, inline: true },
        { name: 'LH/DN', value: `${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].numLastHits}/${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].numDenies}`, inline: true },
        { name: 'HeroDmg', value: `${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].heroDamage}`, inline: true },
        { name: 'TowerDmg', value: `${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].towerDamage}`, inline: true },
        { name: 'Healing', value: `${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].heroHealing}`, inline: true },
        { name: 'Playtime', value: `${formatTime(HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.durationSeconds)}`, inline: true },
        { name: 'Impact', value: `${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.players[0].imp}`, inline: true },
        { name: 'Match ID', value: `${HERO_GUIDES_DATA.heroStats.guide[0].guides[0].match.id}`, inline: true }
      )
      .setImage(`${heroGif}`)

    let early = 'Early game:\n'
    let mid = 'Mid game:\n'
    let late = 'Late game: \n'
    for (let i = 0; i < Object.entries(items.early).length; i++) {
      if (BLACKLIST_ITEMS.includes(`${Object.entries(items.early)[i][1]}`) || Object.entries(items.early)[i][1].toString().endsWith('Recipe')) { continue }
      early += `${Object.entries(items.early)[i].toString().replaceAll(/,/gi, ' ')}\n`
    }
    for (let i = 0; i < Object.entries(items.mid).length; i++) {
      if (BLACKLIST_ITEMS.includes(`${Object.entries(items.mid)[i][1]}`) || Object.entries(items.mid)[i][1].toString().endsWith('Recipe')) { continue }
      mid += `${Object.entries(items.mid)[i].toString().replaceAll(/,/gi, ' ')}\n`
    }
    for (let i = 0; i < Object.entries(items.late).length; i++) {
      if (BLACKLIST_ITEMS.includes(`${Object.entries(items.late)[i][1]}`) || Object.entries(items.late)[i][1].toString().endsWith('Recipe')) { continue }
      late += `${Object.entries(items.late)[i].toString().replaceAll(/,/gi, ' ')}\n`
    }
    const filePathFull = join(__dirname, `img${interaction.id}.png`)
    await generateImageWithTextAndBackground(`Full Item Build for ${HEROES[heroId as number]}`, early, mid, late, BG_PATH, filePathFull)
    const urlFull = await uploadToImgur(`${process.env.imgur}`, filePathFull)
    const secondPage = new EmbedBuilder()
      .setColor('DarkPurple')
      .setFooter({ text: `Data provided by STRATZ.com`, iconURL: `https://stratz.com/images/stratz_knowledge_graph_logo.png` })
      .setTitle(`Guide for ${HEROES[heroId as number]}`)
      .setThumbnail(`${heroIcon}`)
      .setDescription('Item Build')
      .setImage(urlFull)

    const thirdPage = new EmbedBuilder()
      .setColor('DarkPurple')
      .setFooter({ text: `Data provided by STRATZ.com`, iconURL: `https://stratz.com/images/stratz_knowledge_graph_logo.png` })
      .setTitle(`Guide for ${HEROES[heroId as number]}`)
      .setThumbnail(`${heroIcon}`)
      .setDescription('Skill Build')

    embeds.push(firstPage, secondPage, thirdPage)

    const embed = embeds[pages[id]]
    const filter = (i: Interaction) => i.user.id === interaction.user.id
    const time = 1000 * 60 * 5

    await interaction.editReply({
      embeds: [embed],
      components: [getRow(id) as any],
    })

    const collector = interaction.channel?.createMessageComponentCollector({ filter, time })

    if (!collector) return

    collector.on('collect', (btn) => {
      if (!btn) return
      if (btn.message.interaction?.id != msgId) return

      btn.deferUpdate()

      if (btn.customId !== 'prev_embed' && btn.customId !== 'next_embed') return

      if (btn.customId === 'prev_embed' && pages[id] > 0) --pages[id]
      else if (btn.customId === 'next_embed' && pages[id] < embeds.length - 1) ++pages[id]

      interaction.editReply({
        embeds: [embeds[pages[id]]],
        components: [getRow(id) as any]
      })
    })
    unlinkSync(filePathFull)
  }
} as SlashCommand