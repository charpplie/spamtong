import { Utils } from 'comx'
import { APIEmbed, EmbedBuilder, EmbedData } from 'discord.js'

export class CHelpers {
    public createEmbed(data: EmbedData | APIEmbed): EmbedBuilder {
        return new EmbedBuilder(data).setColor(0x9b59b6).setFooter({ text: `${Utils.locale('g.copyright', 'en')}`, iconURL: 'http://176.124.204.212/ico.png' })
    }
}