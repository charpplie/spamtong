import { Event, Events, Constants } from 'comx'

export default {
  name: Events.ClientReady,
  callback: async (c, client) => {
    try {
        // Получаем канал по его ID
        const channel = await client.channels.fetch('783443296382746672');
        
        if (channel) {
            console.log(`Processing channel: ${channel.id}`);

            // Начинаем цикл для получения сообщений и их удаления
            let fetchedMessages;
            do {
                // Получаем последние 100 сообщений
                fetchedMessages = await channel.messages.fetch({ limit: 100 });

                // Фильтруем сообщения, чтобы оставить только те, которые отправил бот
                const botMessages = fetchedMessages.filter(msg => msg.author.id === client.user.id);

                for (const msg of botMessages.values()) {
                    try {
                        await msg.delete();
                        console.log(`Deleted message from ${msg.createdAt}`);
                    } catch (error) {
                        console.error(`Failed to delete message: ${error}`);
                    }
                }

            } while (fetchedMessages.size >= 100); // Повторяем, пока есть сообщения для удаления

        } else {
            console.log('Channel not found or bot does not have access.');
        }
    } catch (error) {
        console.error(`Error fetching the channel: ${error}`);
    }

    // Закрываем соединение с Discord после завершения операции
    client.destroy();
  }
} as Event
