// import { SlashCommandBuilder } from 'discord.js'
// import { SlashCommand } from '../comx'
// import axios from 'axios'
// import { load } from 'cheerio'

// export default {
//   data: new SlashCommandBuilder()
//     .setName('fpv')
//     .setDescription('fpv'),
//   callback: async interaction => {
//     const mresponse = await axios.get('https://lostarmour.info/tags/fpv')
//     const html = mresponse.data

//     const $ = load(html)
//     const videoList: string[] = []

//     $('.container-fluid > .row > main.col-md-6.ms-sm-auto.col-lg-8.px-md-4 > .container > #mycard > .col.tag').each((index: any, element: any) => {
//       const videoUrl = $(element).find('.card.h-100 > .card-body > a').attr('href') || ''
//       videoList.push(videoUrl)
//     })

//     const videoId = videoList[Math.floor(Math.random() * videoList.length)]
//     const targetUrl = 'https://lostarmour.info' + videoId

//     const tresponse = await axios.get(targetUrl)
//     const thtml = tresponse.data

//     const $_ = load(thtml)
//     let videoFileLink
//     const videoFilePath = $_('.container-fluid > .row > col-md-6.ms-sm-auto.col-lg-8.px-md-4 > .container > .row > .col-md-12 > div[itemtype="http://schema.org/VideoObject"] > plyr.plyr--full-ui.plyr--video.plyr--html5.plyr--fullscreen-enabled.plyr--paused.plyr--stopped.plyr--pip-supported > plyr__video-wrapper > video#player')
//     const videoSrc = videoFilePath.find('source').attr('src')

//     console.log(videoSrc)
//   },
//   isOwnerOnly: true
// } as SlashCommand


// /*
//  > .plyr.plyr--full-ui plyr--video plyr--html5.plyr--fullscreen-enabled.plyr--paused plyr--stopped.plyr--pip-supported > .plyr__video-wrapper > #player
// document.querySelector("#player > source")

// document.querySelector("body > div.container-fluid > div:nth-child(1) > main > div.container > div:nth-child(1) > div > div")
// document.querySelector("#player")
// document.querySelector("body > div.container-fluid")
// body > div.container-fluid > div:nth-child(1) > main > div.container > div:nth-child(1) > div > div
// document.querySelector("body > div.container-fluid > div:nth-child(1)")
// document.querySelector("body > div.container-fluid > div:nth-child(1) > main")
// document.querySelector("body > div.container-fluid > div:nth-child(1) > main > div.container")
// document.querySelector("body > div.container-fluid > div:nth-child(1) > main > div.container > div:nth-child(1) > div > div > div.plyr.plyr--full-ui.plyr--video.plyr--html5.plyr--fullscreen-enabled.plyr--paused.plyr--stopped.plyr--pip-supported > div.plyr__video-wrapper")
// */