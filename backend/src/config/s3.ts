import { S3Client } from '@aws-sdk/client-s3';

const bucketName = process.env.AWS_S3_BUCKET;

if (!bucketName) {
  throw new Error('AWS_S3_BUCKET environment variable is missing');
}

export const s3BucketName: string = bucketName;

export const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? 'ap-southeast-2',
});
