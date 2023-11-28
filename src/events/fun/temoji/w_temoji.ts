import { Event, Events } from '@/comx'

function startWeeklyTimer(callback: { (): void; (): void }) {
  const targetDay = 0; // 0 corresponds to Sunday
  const targetHour = 0;
  const targetMinute = 0;

  const timerId = setInterval(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentDay === targetDay && currentHour === targetHour && currentMinute === targetMinute) {
      callback();
    }
  }, 60000);

  return timerId;
}

export default {
  name: Events.ClientReady,
  callback: async (client) => {

    const weeklyTimer = startWeeklyTimer(async () => {
      console.log('asdasdasd')
    })
  }
} as Event