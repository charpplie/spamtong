const REQ_INTERVAL_MAIN = 20000
const REQ_INTERVAL_SECONDARY = 60000

export interface IAppInfo {
    url: string,
    appid: string,
    appid_server: string,
    fmt_name: string,
    interval: number,
    channel: string,
}

export const Apps: IAppInfo[] = [
    {
        url: 'https://api.steampowered.com/IGCVersion_570/GetServerVersion/v1/',
        appid: '570',
        appid_server: '373310',
        fmt_name: 'Dota 2',
        interval: REQ_INTERVAL_MAIN,
        channel: '1374375965618208899',
    },
    {
        url: 'https://api.steampowered.com/IGCVersion_2305270/GetServerVersion/v1/',
        appid: '2305270',
        appid_server: '2305290',
        fmt_name: 'Dota 2 Staging',
        interval: REQ_INTERVAL_MAIN,
        channel: '1374375965618208899',
    },
    {
        url: 'https://api.steampowered.com/IGCVersion_247040/GetServerVersion/v1/',
        appid: '247040',
        appid_server: '247060',
        fmt_name: 'Dota 2 Experimental',
        interval: REQ_INTERVAL_MAIN,
        channel: '1374375965618208899',
    },
    {
        url: 'https://api.steampowered.com/IGCVersion_1422450/GetServerVersion/v1/',
        appid: '1422450',
        appid_server: '1422460',
        fmt_name: 'Deadlock',
        interval: REQ_INTERVAL_MAIN,
        channel: '1374376029518434405',
    },
    {
        url: 'https://api.steampowered.com/IGCVersion_3488080/GetServerVersion/v1/',
        appid: '3488080',
        appid_server: '3488100',
        fmt_name: 'Deadlock Experimental',
        interval: REQ_INTERVAL_MAIN,
        channel: '1374376029518434405',
    },
    {
        url: 'https://api.steampowered.com/IGCVersion_440/GetServerVersion/v1/',
        appid: '440',
        appid_server: '232250',
        fmt_name: 'Team Fortress 2',
        interval: REQ_INTERVAL_SECONDARY,
        channel: '1374376059293667368',
    },
]