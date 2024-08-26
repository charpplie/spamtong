import { Event, Events, Constants } from 'comx'

export default {
  name: Events.ClientReady,
  callback: async (c, client) => {
    try {
        // Замените на ID пользователя, DM с которым вы хотите найти
        const userId = '445661951238995998';

        // Получаем пользователя по его ID
        const user = await client.users.fetch(userId);

        if (user) {
            // Получаем DM-канал с пользователем
            const dmChannel = await user.createDM();
            console.log(`DM Channel ID with ${user.tag}: ${dmChannel.id}`);

            // Теперь вы можете использовать этот DM-канал для удаления сообщений
            let fetchedMessages;
            do {
                // Получаем последние 100 сообщений
                fetchedMessages = await dmChannel.messages.fetch({ limit: 100 });

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
            console.log('User not found.');
        }
    } catch (error) {
        console.error(`Error fetching the user or DM channel: ${error}`);
    }

    // Закрываем соединение с Discord после завершения операции
    client.destroy();
  }
} as Event
