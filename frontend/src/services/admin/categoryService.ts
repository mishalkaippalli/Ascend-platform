
import api from '../api/axios'
import type {
  Category,
  CreateCategoryDTO,
  CreateCategoryResponse,
  GetAdminCategoriesResponse,
  GetCategoriesResponse,
  PublicCategory,
  UpdateCategoryDTO,
  UpdateCategoryResponse,
  UpdateCategoryStatusDTO,
} from '../../types/category'

// Public endpoint: returns active categories only.
export async function getCategories(): Promise<PublicCategory[]> {
  const response = await api.get<GetCategoriesResponse>('/categories')
  return response.data.data
}

// Existing feature: create a category.
export async function createCategory(
  data: CreateCategoryDTO,
): Promise<Category> {
  const response = await api.post<CreateCategoryResponse>(
    '/admin/categories',
    data,
  )
  return response.data.data
}

// Admin endpoint: returns active and inactive categories.
export async function getAdminCategories(): Promise<Category[]> {
  const response = await api.get<GetAdminCategoriesResponse>(
    '/admin/categories',
  )
  return response.data.data
}

// Edit a category's name and/or description.
export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryDTO,
): Promise<Category> {
  const response = await api.patch<UpdateCategoryResponse>(
    `/admin/categories/${categoryId}`,
    data,
  )
  return response.data.data
}

// Activate or deactivate a category.
export async function updateCategoryStatus(
  categoryId: string,
  data: UpdateCategoryStatusDTO,
): Promise<Category> {
  const response = await api.patch<UpdateCategoryResponse>(
    `/admin/categories/${categoryId}/status`,
    data,
  )
  return response.data.data
}
