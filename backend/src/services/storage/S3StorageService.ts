import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { IStorageService } from '../../interfaces/service/storage/IStorageService.js';

export class S3StorageService implements IStorageService {
  constructor(
    private readonly _s3Client: S3Client,
    private readonly _bucketName: string,
  ) {}

  async generateUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 300,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this._bucketName,
      Key: key,
      ContentType: contentType,
    });

    // Generate a temporary URL that allows uploading this object to S3.
    return getSignedUrl(this._s3Client, command, { expiresIn });
  }
}
