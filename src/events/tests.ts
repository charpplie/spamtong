import { Event, Events, Prisma, Utils } from 'comx'
import { TextChannel } from 'discord.js'
import Parser from 'rss-parser'

const Blogs = [
    'https://devblogs.microsoft.com/directx/feed/',
    'https://devblogs.microsoft.com/cppblog/feed/',
    'https://devblogs.microsoft.com/oldnewthing/feed',
    'https://devblogs.microsoft.com/visualstudio/feed/',
]

const GUILD = '1335656368241119352'
const CHANNEL = '1397569389292945529'
// const CHANNEL = '1340374435294740560'

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance) => {
        const guild = instance.client.guilds.cache.get(GUILD)
        const channel = guild?.channels.cache.get(CHANNEL) as TextChannel

        const parser = new Parser()

        while (true) {
            // console.log('b')
            Blogs.forEach(async (blog) => {
                await Utils.Sleep(1000)

                const feed = await parser.parseURL(blog)

                const _blog = feed.items[0]
                const blog_obj = await Prisma.msdevblogs.findFirst({ where: { blog: `${blog}` } })
                let guid = ''

                if (!blog_obj) {
                    await Prisma.msdevblogs.create({
                        data: {
                            blog: blog,
                            lastPost: _blog.guid!
                        }
                    })
                } else {
                    guid = blog_obj.lastPost

                    await Prisma.msdevblogs.update({
                        where: { id: blog_obj.id }, data: {
                            lastPost: _blog.guid
                        }
                    })
                }

                if (guid != _blog.guid) {
                    await channel.send(`New [MS Dev Blog](${_blog.link})`)
                }
            })

            await Utils.Sleep(1000 * 60 * 60 * 6)
            await Utils.Sleep(2000)
        }
    }
} as Event