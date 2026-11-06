export type BookAssetType = 'coverImage' | 'promotionalVideo' | 'audioPreview';

export interface IGenerateBookAssetUploadUrlDTO {
  assetType: BookAssetType;
  contentType: string;
}

export interface ICompleteBookAssetUploadDTO {
  assetType: BookAssetType;
  key: string;
}

// Defines the data returned after generating an S3 upload URL.
export interface IGenerateBookAssetUploadUrlResponseDTO {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}
