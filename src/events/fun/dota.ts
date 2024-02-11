import { Event, Events } from 'comx'

export default {
  name: Events.MessageCreate,
  callback: async (msg) => {
    if (msg.author.bot) return

    try {
      if (msg.content === "О, Великий Спамтон Г. Спамтон, позвольте мне, простобу рабочему Иван город Бокино, обратиться к Вам и спросить следующее: следует ли мне сегодня зайти в компьютерную игру Dota 2") {
        const chance = Math.floor(Math.random() * 101)
        if (chance <= 76) {
          msg.reply("Именем моих предков и той силою, что они наделили меня, я с открытой уверенность сообщаю вам, моим любимым рабам, что вам необходимо сегодня зайти в компьютерную игру Dota 2")
        } else {
          msg.reply("*Спамтон упал с лестницы и пернул*")
        }
      }
    } catch (why) {
      console.error(why)
    }
  }
} as Event