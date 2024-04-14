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