export interface ICreateCategoryDTO {
  name: string,
  description ?: string
}

export interface IUpdateCategoryDTO {
  name?: string;
  description?: string;
}

export interface IUpdateCategoryStatusDTO {
  isActive: boolean;
}

export interface CategoryResponseDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface ActiveCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
}