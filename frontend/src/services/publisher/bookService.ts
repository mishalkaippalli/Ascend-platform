
import api from '../api/axios'
import type {
  PublicCategory,
  GetCategoriesResponse,
} from '../../types/category'
import type {
  CreateBookDTO,
  CreateBookResponse,
} from '../../types/book'

// Fetch active categories for the category selector.
export async function getBookCategories(): Promise<PublicCategory[]> {
  const response = await api.get<GetCategoriesResponse>('/categories')

  return response.data.data
}

// Create a book draft for the authenticated publisher.
export async function createBook(
  data: CreateBookDTO,
): Promise<CreateBookResponse['data']> {
  const response = await api.post<CreateBookResponse>(
    '/publishers/books',
    data,
  )

  return response.data.data
}
