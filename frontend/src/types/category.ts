
/** Category returned by the public endpoint. */
export interface PublicCategory {
  id: string
  name: string
  slug: string
  description?: string
}

/** Category returned by admin endpoints, including inactive categories. */
export interface Category extends PublicCategory {
  isActive: boolean
}

export interface CreateCategoryDTO {
  name: string
  description?: string
}

export interface UpdateCategoryDTO {
  name?: string
  description?: string
}

export interface UpdateCategoryStatusDTO {
  isActive: boolean
}

export interface CreateCategoryResponse {
  success: boolean
  message: string
  data: Category
}

export interface GetCategoriesResponse {
  success: boolean
  message: string
  data: PublicCategory[]
}

export interface GetAdminCategoriesResponse {
  success: boolean
  message: string
  data: Category[]
}

export interface UpdateCategoryResponse {
  success: boolean
  message: string
  data: Category
}
