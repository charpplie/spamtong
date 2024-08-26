import { Event, Events, Constants } from 'comx'

export default {
  name: Events.ClientReady,
  callback: async (c, client) => {
   const dmChannels = client.channels.cache.filter(
    (channel) => channel.type === 1 // 0 - тип канала DM
  );

  // Проходимся по каждому DM каналу
  for (const channel of dmChannels.values()) {
    // Получаем все сообщения в канале
    const messages = await channel.messages.fetch();

    // Фильтруем сообщения, отправленные ботом
    const botMessages = messages.filter((message) => message.author.bot);

    // Удаляем сообщения бота
    if (botMessages.size > 0) {
      await channel.bulkDelete(botMessages);
      console.log(`Удалено ${botMessages.size} сообщений бота в канале ${channel.id}`);
    }
  }
  }
} as Event
