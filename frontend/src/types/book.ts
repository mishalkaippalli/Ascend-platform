
export interface CreateBookDTO {
  title: string
  description: string
  authors: string[]
  categoryIds: string[]
  price: number
  salePrice?: number
  language: string
  previewText?: string
}

// The API returns these fields after creating a draft.
export interface CreateBookResponse {
  success: boolean
  message: string
  data: {
    id: string
    title: string
    slug: string
    status: 'draft'
  }
}
