interface IEmojiSet {
    [key: string]: string
}

// emoji : role
export const EmojiSets: IEmojiSet = {
    '1435322122254680064': '1435623792138391632', //dota
    '1435320975716778025': '1435623823033634836', //minecraft
    '1435322300974239764': '1435623842625359893', //roblox
    '1435322449334898870': '1435623861138751488', //amogus
    '1437863993883627761' : '1437864173521338449', //l4d2
    '1446562055032406016' : '1446562172883833075', // drg
    '1450063972110831689' : '1450064217062244434', //deadlock
    '1459572551629148200' : '1459572729333284885', //lethal company
}

export const EmojiKeys = Object.keys(EmojiSets)

export const PING_ROLES_FILENAME = './content/ping_roles_msg_id'