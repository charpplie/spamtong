interface IEmojiSet {
    [key: string]: string
}

export const EmojiSets: IEmojiSet = {
    '1435322122254680064': '1435623792138391632', //dota
    '1435320975716778025': '1435623823033634836', //minecraft
    '1435322300974239764': '1435623842625359893', //roblox
    '1435322449334898870': '1435623861138751488' //amogus
}

export const EmojiKeys = Object.keys(EmojiSets)

export const PING_ROLES_FILENAME = './content/ping_roles_msg_id'