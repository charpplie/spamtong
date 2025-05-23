export interface IAppInfo {
    url: string,
    appid: string,
    appid_server: string,
    fmt_name: string,
    channel: string,
    shouldDump: boolean,
}

export const AppIds = [
    // dota2
    // dota2 staging
    // dota2 test
    // deadlock
    // deadlock test
    // tf2
    // cs2

    // Clients
    '570',
    '2305270',
    '247040',
    '1422450',
    '3488080',
    '440',
    // '730',

    // Servers
    '373310',
    '2305290',
    '247060',
    '1422460',
    '3488100',
    '232250',
]

export const AppInfos: IAppInfo[] = [
    {
        url: 'https://api.steampowered.com/IGCVersion_570/GetServerVersion/v1/',
        appid: '570',
        appid_server: '373310',
        fmt_name: 'Dota 2',
        channel: '1374375965618208899',
        shouldDump: false,
    },
    {
        url: 'https://api.steampowered.com/IGCVersion_2305270/GetServerVersion/v1/',
        appid: '2305270',
        appid_server: '2305290',
        fmt_name: 'Dota 2 Staging',
        channel: '1374375965618208899',
        shouldDump: false,
    },
    {
        url: 'https://api.steampowered.com/IGCVersion_247040/GetServerVersion/v1/',
        appid: '247040',
        appid_server: '247060',
        fmt_name: 'Dota 2 Experimental',
        channel: '1374375965618208899',
        shouldDump: false,
    },
    {
        url: 'https://api.steampowered.com/IGCVersion_1422450/GetServerVersion/v1/',
        appid: '1422450',
        appid_server: '1422460',
        fmt_name: 'Deadlock',
        channel: '1374376029518434405',
        shouldDump: true,
    },
    {
        url: 'https://api.steampowered.com/IGCVersion_3488080/GetServerVersion/v1/',
        appid: '3488080',
        appid_server: '3488100',
        fmt_name: 'Deadlock Experimental',
        channel: '1374376029518434405',
        shouldDump: false,
    },
    {
        url: 'https://api.steampowered.com/IGCVersion_440/GetServerVersion/v1/',
        appid: '440',
        appid_server: '232250',
        fmt_name: 'Team Fortress 2',
        channel: '1374376059293667368',
        shouldDump: false,
    },
]