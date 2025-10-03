import { EventTg, Prisma } from 'comx'

const ROLE_ID = '1422947433209663568'
// const ROLE_ID = '1422976063587352576'
const CHAT_ID = '-1002800988001'

export default {
    name: ':new_chat_members',
    dev: true,
    callback: async (instance, ctx) => {
        console.log(ctx)
    }
} as EventTg