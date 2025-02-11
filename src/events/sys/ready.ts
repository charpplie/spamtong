import { Event, Events, Constants } from 'comx'
import { EmbedBuilder } from 'discord.js'
import axios from 'axios'

const args = process.argv.slice(2)
const noUpdate = args.includes('--noUpdate')

const DEV_GUILD = '1335656368241119352'
const DEV_CHANNEL = '1337497425019146272'

export default {
  name: Events.ClientReady,
  dev: true,
  callback: async (instance, client) => {
    if (noUpdate) return

    const guild = client.guilds.cache.get(DEV_GUILD)!
    const channel = guild.channels.cache.get(DEV_CHANNEL)!

    const info = await getLatestCommit(`${process.env.gh_owner}`, `${process.env.gh_repo}`, `${process.env.gh_token}`)
    const changes = (await getCommitChanges(`${process.env.gh_owner}`, `${process.env.gh_repo}`, info.sha, `${process.env.gh_token}`))!

    const embed = new EmbedBuilder()
      .setColor('DarkPurple')
      .setFooter({ text: Constants.copyright, iconURL: instance.getOwnerIcon() })
      .setAuthor({ name: `${info.commit.committer.name}`, iconURL: `${info.author.avatar_url}`, url: `${info.author.html_url}` })
      .setTitle('Обновление Спемтона!')
      .setFields(
        { name: 'Хэш', value: `${info.sha}` },
        { name: 'Изменения', value: `${info.commit.message}` },
        { name: 'Всего изменений', value: `[${changes[0]}]: +${changes[1]}/-${changes[2]}` },
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

    const additions = files[0].additions
    const deletions = files[0].deletions
    const changes   = files[0].changes

    return [changes, additions, deletions]!
  } catch (why) {
    console.error(why)
  }
}
