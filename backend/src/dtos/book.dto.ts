export interface ICreateBookDTO {
  title: string;
  description: string;
  authors: string[];
  categoryIds: string[];

  // Publishers enter prices in rupees; the service converts them to paise.
  price: number;
  salePrice?: number;

  language: string;

  previewText?: string;
}