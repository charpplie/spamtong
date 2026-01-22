import { TextChannel, Message, Snowflake } from 'discord.js'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { I18n } from 'i18n'
import { FFmpeggy } from 'ffmpeggy'
import ffmpegBin from 'ffmpeg-static'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const i18n = new I18n({
  locales: [
    'en',
    'ru'
  ],
  directory: './locales',
  defaultLocale: 'en',
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,
  updateFiles: false,
  logWarnFn: function (msg) {
    console.log(msg)
  },
  logErrorFn: function (msg) {
    console.log(msg)
  },
  missingKeyFn: function (locale, value) {
    return value
  },
})

const RANDOM_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const RANDOM_CHARS_LENGTH = RANDOM_CHARS.length

export class CUtils {
  public ffmpegg: FFmpeggy

  public constructor() {
    FFmpeggy.DefaultConfig = {
      ...FFmpeggy.DefaultConfig,
      'ffmpegBin': ffmpegBin as string,
    }

    this.ffmpegg = new FFmpeggy()
  }

  public async readObjects<T>(dir: string, concurrency: number = 10): Promise<T[]> {
    const stack: string[] = [dir]
    const objects: T[] = []
    const filesToImport: string[] = []

    while (stack.length > 0) {
      const currentDir = stack.pop()
      if (!currentDir) continue

      try {
        const files = await readdir(currentDir, { withFileTypes: true })

        for (const file of files) {
          if (file.name.startsWith('!') || (!file.isDirectory() && !file.name.endsWith('.ts'))) continue

          const filePath = join(currentDir, file.name)
          if (file.isDirectory()) {
            stack.push(filePath)
          } else {
            filesToImport.push(filePath)
          }
        }
      } catch (error) {
        console.error(`Error reading directory ${currentDir}: ${error}`)
      }
    }

    const importWithConcurrency = async () => {
      let index = 0
      const queue: Promise<void>[] = []

      const worker = async () => {
        while (index < filesToImport.length) {
          const filePath = filesToImport[index++]
          try {
            const object: T = (await import('file://' + filePath)).default
            objects.push(object)
          } catch (error) {
            console.error(`Error importing file ${filePath}: ${error}`)
          }
        }
      }

      for (let i = 0; i < Math.min(concurrency, filesToImport.length); i++) {
        queue.push(worker())
      }

      await Promise.all(queue)
    }

    await importWithConcurrency()

    return objects
  }

  public Sleep(ms: number): Promise<unknown> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  public Random(limit: number): number {
    return Math.floor(Math.random() * limit)
  }

  public RandomText(length: number): string {
    let randomText = ''

    for (let i = 0; i < length; i++) {
      randomText += RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS_LENGTH)]
    }
    
    return randomText
  }

  public async fetchMessages(channel: TextChannel, limit: number): Promise<Message[]> {
    let out: Message[] = []

    if (limit <= 100) {
      const messages = await channel.messages.fetch({ limit: limit })
      out.push(...messages.values())
    } else {
      let rounds = Math.ceil(limit / 100)
      let lastId: Snowflake | undefined = undefined

      for (let i = 0; i < rounds; i++) {
        const options: { limit: number; before?: Snowflake } = {
          limit: 100
        }

        if (lastId) {
          options.before = lastId
        }

        const messages = await channel.messages.fetch(options)

        if (messages.size === 0) break

        out.push(...messages.values())
        lastId = messages.lastKey()!
      }
    }

    return out
  }

  // public async uploadToImgur(accessToken: string, filename: string) {
  //   try {
  //     const response = await axios.post(
  //       'https://api.imgur.com/3/image',
  //       { image: readFileSync(filename, 'base64'), type: 'base64' },
  //       { headers: { Authorization: `Client-ID ${accessToken}` } },
  //     )

  //     return response.data.data.link
  //   } catch (why) {
  //     console.error(why)
  //   }
  // }

  // public async safeAxios<T = any, D = any>(url: string, options: safeAxiosOptions, config?: AxiosRequestConfig<D>): Promise<AxiosResponse<T, D>> {
  //   const {
  //     maxRetries,
  //     retryDelay
  //   } = options

  //   let retries = 0

  //   while (retries < maxRetries) {
  //     try {
  //       const response: AxiosResponse<T, D> = await axios(url, config)
  //       return response
  //     } catch (error) {
  //       if (axios.isAxiosError(error)) {
  //         console.error(`Axios request failed (retry ${retries + 1}/${maxRetries}):`, error.message)
  //         if (error.response) {
  //           console.error('Response data:', error.response.data)
  //           console.error('Response status:', error.response.status)
  //           console.error('Response headers:', error.response.headers)
  //         } else if (error.request) {
  //           console.error('No response received:', error.request)
  //         } else {
  //           console.error('Error setting up request:', error.message)
  //         }
  //       } else {
  //         console.error(`Unexpected error during request (retry ${retries + 1}/${maxRetries}):`, error)
  //       }

  //       retries++

  //       if (retries < maxRetries) {
  //         await new Promise(resolve => setTimeout(resolve, retryDelay))
  //       }
  //     }
  //   }

  //   throw new Error(`Failed to fetch from ${url} after ${maxRetries} attempts.`)
  // }

  public locale(phrase: string, locale: string): string {
    return i18n.__({ phrase: phrase, locale: locale })
  }

  private static algo = 'aes-256-cbc'
  private static key = randomBytes(32)
  private static iv = randomBytes(16)
  private static keyZero = Buffer.from('00000000000000000000000000000000', 'hex')
  private static ivZero = Buffer.from('0000000000000000', 'hex')

  public encrypt(str: string, zeros: boolean = false): string {
    const key = zeros ? CUtils.keyZero : CUtils.key
    const iv = zeros ? CUtils.ivZero : CUtils.iv
    const cipher = createCipheriv(CUtils.algo, key, iv)
    return cipher.update(str, 'utf-8', 'hex') + cipher.final('hex')
  }

  public decrypt(str: string, zeros: boolean = false): string {
    const key = zeros ? CUtils.keyZero : CUtils.key
    const iv = zeros ? CUtils.ivZero : CUtils.iv
    const decipher = createDecipheriv(CUtils.algo, key, iv)
    return decipher.update(str, 'hex', 'utf-8') + decipher.final('utf-8')
  }
}

// interface safeAxiosOptions {
//   maxRetries: number,
//   retryDelay: number
// }