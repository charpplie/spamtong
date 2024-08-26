import { Event, Events, Constants } from 'comx'

export default {
  name: Events.ClientReady,
  callback: async (c, client) => {
    const channels = await client.channels.fetch();

    for (const channel of channels.values()) {
        if (channel.type === 'DM') {
            try {
                let lastId;

                while (true) {
                    const options = { limit: 100 };
                    if (lastId) {
                        options.before = lastId;
                    }

                    const messages = await channel.messages.fetch(options);

                    if (messages.size === 0) {
                        break;
                    }

                    const botMessages = messages.filter(msg => msg.author.id === client.user.id);

                    for (const message of botMessages.values()) {
                        await message.delete();
                    }

                    lastId = messages.last().id;
                }

                console.log(`Все сообщения бота удалены в канале ${channel.id}`);
            } catch (error) {
                console.error(`Не удалось обработать канал ${channel.id}:`, error);
            }
        }
    }
  }
} as Event
