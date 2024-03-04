import { readdir, lstat } from 'fs/promises'
import { Client } from 'discord.js'
import { join } from 'path'

export async function FeaturesHandler(client: Client, featuresDir: string) {
  async function readFeatures(dir: string) {
    const files = await readdir(dir)

    await Promise.all(
      files.map(async (file) => {
        const filePath = join(dir, file)
        const fileStat = await lstat(filePath)
        if (!fileStat.isDirectory() && !filePath.endsWith('.ts')) return
        if (file.charAt(0) === '!') return
        if (fileStat.isDirectory()) {
          await readFeatures(filePath)
          return
        }

        const feature = await import(filePath)
        client.on('ready', async (...args) => { if (feature.default && typeof feature.default === 'function') await feature.default(...args) })
      })
    )
  }

  await readFeatures(featuresDir)
}