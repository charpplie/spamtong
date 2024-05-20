import { Sequelize, DataType } from 'sequelize'
import { join } from 'path'
import { Jukai } from './jukai'

export class Params {
  private static instance: Params
  // private storeInOneFile: boolean
  private commandsFile: string
  private eventsFile: string
  private guildsFile: string
  private commandsModel: any
  private eventsModel: any
  private guildsModel: any

  private constructor(instance: Jukai, options: Options) {
    const {
      commandsFile,
      eventsFile,
      guildsFile,
      // baseUrl,
    } = options

    // if (baseUrl) {
    //   this.commandsFile = join(baseUrl, commandsFile)
    //   this.eventsFile = join(baseUrl, eventsFile)
    //   this.guildsFile = join(baseUrl, guildsFile)
    // } else {
      this.commandsFile = commandsFile
      this.eventsFile = eventsFile
      this.guildsFile = guildsFile
    // }

    
  }

  public static getInstance(instance: Jukai, options: Options): Params {
    if (!this.instance)
      return new Params(instance, options)

    return this.instance
  }

  public getSettings() { }

  public refreshSettings() { }
}

interface Options {
  commandsFile: string,
  eventsFile: string,
  guildsFile: string,
  baseUrl?: string,
}