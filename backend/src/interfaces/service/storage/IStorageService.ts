export interface IStorageService {
  generateUploadUrl(
    key: string,
    contentType: string,
    expiresIn?: number,
  ): Promise<string>;
}
