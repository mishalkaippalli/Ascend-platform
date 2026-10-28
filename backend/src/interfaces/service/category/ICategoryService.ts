import type { ICreateCategoryDTO,
  IUpdateCategoryDTO,
  IUpdateCategoryStatusDTO,
  CategoryResponseDTO,
  ActiveCategoryDTO
  } from '../../../dtos/category.dto';

import type { Types } from 'mongoose';

export interface ICategoryService {
  createCategory(
    data: ICreateCategoryDTO,
  ): Promise<CategoryResponseDTO>;

  updateCategory(
    categoryId: Types.ObjectId,
    data: IUpdateCategoryDTO,
  ): Promise<CategoryResponseDTO>;

  updateCategoryStatus(
    categoryId: Types.ObjectId,
    data: IUpdateCategoryStatusDTO,
  ): Promise<CategoryResponseDTO>;

  getActiveCategories(): Promise<ActiveCategoryDTO[]>;
  
  getAllCategories(): Promise<CategoryResponseDTO[]>;
}
