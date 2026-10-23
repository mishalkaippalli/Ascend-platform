import type { ICreateCategoryDTO } from '../../../dtos/category.dto';
import type { CategoryDocument } from '../../../models/category/category.model';

export interface ICategoryService {
  createCategory(data: ICreateCategoryDTO): Promise<CategoryDocument>;

  getActiveCategories(): Promise<CategoryDocument[]>;
}