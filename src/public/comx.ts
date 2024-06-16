import { CUtils } from './classes/utils'

export const Utils = new CUtils()

export const Constants = {
  vcont_channels: ['1173213492153688098'],
  vcont_reacts: [
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    // '⭐',
  ],
  icont: [
    {
      guildId: '1150427580734906368',
      channelId: '1177374466448302180',
      users: [
        {
          id: '255594607'
        },
      ]
    }
  ],
  icont_album: '-15',
  gcont: [
    {
      guild: '1150427580734906368',
      channel: '1220325347699195965',
      groups: [
        {
          id: '135729590'
        },
      ]
    },
  ],
  funlog_guild: '1150427580734906368',
  funlog_channel: '1204439974766706698',
  log_channel: '1173213492153688098',
  copyright: 'xyerssisya (C) 2021-2024. All kromers reserved.'
}

import S3 from 'aws-sdk/clients/s3'
import { createReadStream } from 'fs'
import { basename } from 'path'

const S3Storage = new S3({
  accessKeyId: `${process.env.bucketAccessKey}`,
  secretAccessKey: `${process.env.bucketSecretAccessKey}`,
  endpoint: 'https://s3.timeweb.cloud',
  s3ForcePathStyle: true,
  region: 'ru-1',
  apiVersion: 'latest',
})

export async function uploadToBucket(fileName: string): Promise<string | undefined> {
  try {
    const res = await S3Storage.upload({
      Bucket: `${process.env.bucketName}`,
      Key: basename(fileName),
      Body: createReadStream(fileName),
    }).promise()

    return res.Location
  } catch (why) {
    console.error(why)
  }
}

export async function fetchObjectsInBucket(): Promise<string[] | undefined> {
  try {
    const list = await S3Storage.listObjectsV2({
      Bucket: `${process.env.bucketName}`
    }).promise()

    if (!list.KeyCount || !list.Contents) return

    const keys: string[] = []

    for (let i = 0; i < list.KeyCount; i++) {
      if (list.Contents[i].Key === undefined) continue 
      keys.push(list.Contents[i].Key!)
    }

    return keys
  } catch (why) {
    console.error(why)
  }
}

export async function deleteObjectInBucket(objectkey: string): Promise<void> {
  try {
    await S3Storage.deleteObject({
      Bucket: `${process.env.bucketName}`,
      Key: objectkey,
    }).promise()
  } catch (why) {
    console.error(why)
  }
}

export { Command } from './structures/command'
export { Event, Events } from './structures/event'
