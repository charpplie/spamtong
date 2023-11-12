import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../comx'
import { join } from 'path'

export default {
  name: 'поздравление1',
  description: 'Вы смогли найти ответ на наш первый вопрос, чтобы найти свой первый вопрос!',
  callback: async interaction => {
    await interaction.reply({
      content: `Ну и ну! Вы таки решили нашу первую загадку! Для получения награды за ваш труд и следующим вопросом обратитесь к Новому Свету!`
    })
  }
} as SlashCommand