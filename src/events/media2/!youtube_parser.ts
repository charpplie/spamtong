import { Event, Events, Prisma, Utils, Config } from 'comx'
import protobuf from 'protobufjs'
import SteamUser from 'steam-user'

const server = 'cmp2-fra2.steamserver.net:27018'
// const server = 'https://echo.websocket.org/'

export default {
    name: Events.ClientReady,
    dev: true,
    callback: async (instance) => {
        const steam = new SteamUser()
        steam.logOn({ anonymous: true })

        steam.getProductChanges(0, () => { })
        // const socket = new WebSocket(`wss://${server}/cmsocket/`)

        // const header = { msg: 8901 }
        // const emsg = header.msg

        // const _body = {
        //     since_change_number: 0,
        //     send_app_info_changes: true,
        //     send_package_info_changes: true,
        // }
        // // steammessages_clientserver_appinfo
        // const root = new protobuf.Root()
        // root.load('E:\\!PROD\\spamtong\\steammessages_clientserver_appinfo.proto', {
        //     keepCase: true
        // }, (err, root) => {
        //     // load('E:\\!PROD\\spamtong\\test.proto', (err, root) => {
        //     if (err)
        //         throw err

        //     const msg = root?.lookupType('CMsgClientPICSChangesSinceRequest',)
        //     // const msg = root?.lookupType('TestMessage')

        //     // let _msg = msg?.create({ 
        //     //     since_change_number: 0,
        //     //     send_app_info_changes: true,
        //     //     send_package_info_changes: true
        //     // })

        //     let _msg = msg?.create({
        //         since_change_number: 0,
        //         send_app_info_changes: true,
        //         send_package_info_changes: true,
        //     })

        //     console.log(`${JSON.stringify(_msg)}`)

        //     let buffer = msg?.encode(_msg!).finish()
        //     console.log(Array.prototype.toString.call(buffer))

        //     let hdrBuf

        //     let outputBuffer = Buffer.concat([hdrBuf.flip().toBuffer(), _body])

        //     socket.addEventListener('open', event => {
        //         console.log('WebSocket connection established')
        //         // const data = {
        //         //     protocol_version: 3,

        //         // }

        //         socket.send(JSON.stringify(buffer))
        //     })

        //     // let decoded = msg?.decode(buffer!)
        //     // console.log(JSON.stringify(decoded))
        // })
        // // const Proto = 

        // socket.addEventListener('message', event => {
        //     console.log('Message from server: ', event.data)
        // })

        // socket.addEventListener('close', event => {
        //     console.log('WebSocket connection closed:', event.code, event.reason)
        // })

        // socket.addEventListener('error', error => {
        //     console.error('WebSocket error:', error)
        // })
    }
} as Event