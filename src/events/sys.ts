import { Event, Events, Utils } from 'comx'
import os from "os"
import { Jukai } from '../public/classes/jukai'
import { ActivityType } from 'discord.js'

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance: Jukai) => {
        // instance.client.user?.setStatus('dnd')

        while (true) {
            instance.client.user?.setActivity({
                name: `${getLocalIP()}`,
                type: ActivityType.Listening,
            })
            await Utils.Sleep(1 * 60 * 60 * 1000)
        }

    }
} as Event

function getLocalIP(): string[] {
    const interfaces = os.networkInterfaces();
    const result: string[] = [];
  
    for (const name in interfaces) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === "IPv4" && !iface.internal) {
          result.push(iface.address);
        }
      }
    }
  
    return result;
  }