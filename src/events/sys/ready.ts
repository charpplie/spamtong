import { Event, Events, Constants } from 'comx'
import { EmbedBuilder } from 'discord.js'
import axios from 'axios'

const args = process.argv.slice(2)
const noUpdate = args.includes('--noUpdate')

const DEV_GUILD = '1150427580734906368'
const DEV_CHANNEL = '1173213492153688098'

export default {
  name: Events.ClientReady,
  callback: async (instance, client) => {
    if (noUpdate) return

    const guild = client.guilds.cache.get(DEV_GUILD)!
    const channel = guild.channels.cache.get(DEV_CHANNEL)!

    const info = await getLatestCommit(`${process.env.gitowner}`, `${process.env.gitrepo}`, `${process.env.github}`)
    const changes = (await getCommitChanges(`${process.env.gitowner}`, `${process.env.gitrepo}`, info.sha, `${process.env.github}`))!

    const embed = new EmbedBuilder()
      .setColor('DarkPurple')
      .setFooter({ text: Constants.copyright, iconURL: instance.getOwnerIcon() })
      .setAuthor({ name: `${info.commit.committer.name}`, iconURL: `${info.author.avatar_url}`, url: `${info.author.html_url}` })
      .setTitle('Обновление Спемтона!')
      .setFields(
        { name: 'Хэш', value: `${info.sha}` },
        { name: 'Изменения', value: `${info.commit.message}` },
        { name: 'Всего изменений', value: `+${changes[0]}/-${changes[1]}` },
      )

    await channel.send({
      embeds: [embed]
    })
  }
} as Event

async function getLatestCommit(owner: string, repo: string, token: string): Promise<any> {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits`

  try {
    const r = await axios.get(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      }
    })

    const commitInfo = r.data[0]

    return commitInfo
  } catch (why) {
    console.error(why)
  }
}

async function getCommitChanges(owner: string, repo: string, commitSha: string, token: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    const files = response.data.files

    let additions = 0
    let deletions = 0
    files.forEach((file: { additions: number; deletions: number }) => {
      additions += file.additions
      deletions += file.deletions
    })

    return [additions, deletions]!
  } catch (why) {
    console.error(why)
  }
}