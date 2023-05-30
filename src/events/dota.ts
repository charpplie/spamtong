// import { TextBasedChannel } from 'discord.js'
// import { Event, Events, CustomClient } from '../comx'
// import axios from 'axios'

// function sleep(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms))}

// async function getCommitDetails(owner: string, repo: string, commitSha: string) {
//   const url = `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`

//   try {
//     const response = await axios.get(url)
//     const commitDetails = response.data

//     const changedFiles = commitDetails.files.map((file: any) => file.filename)
//     console.log('Changed files:', changedFiles)
//   } catch (error) {}
// }

// async function getLatestCommitSHA(owner: string, repo: string): Promise<string> {
//   const url = `https://api.github.com/repos/${owner}/${repo}/commits`

//   const response = await axios.get(url).catch(why => {
//     console.error(why)
//   })

//   if (response) {
//     const latestCommit = response.data[0]
//     const sha: string = latestCommit.sha
//     return sha
//   }

//   return 'undefined'
// }

// export default {
//   name: Events.ClientReady,
//   once: true,
//   callback: async (cclient) => {
//     console.log('a')
//     const client = cclient as CustomClient

//     client.user?.setStatus('idle')
//     console.log('b')

//     const channel = client.channels.cache.get('1058064189610020914') as TextBasedChannel

//     console.log('c')
//     let oldSha = ''
//     while (true) {

//       console.log('d')
//       let newSha = await getLatestCommitSHA('charpplie', 'SpamtongTracking_Test')

//       console.log('e')
//       if (newSha == oldSha) continue

//       console.log('f')
//       if (newSha && newSha !== 'undefined') oldSha = newSha
//       else continue

//       console.log('g')
//       channel.send(`New commit detected! Commit SHA: ${newSha}`)

//       console.log(`${newSha}, ${oldSha}`)

//       await sleep(5000)
//     }
//   }
// } as Event