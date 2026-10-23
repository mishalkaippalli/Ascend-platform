import { ICategoryRepository } from '../../interfaces/repository/ICategoryRepository';
import { BaseRepository } from '../base.repository';

import {
  Category,
  CategoryDocument,
  ICategory,
} from '../../models/category/category.model';

export class CategoryRepository
  extends BaseRepository<ICategory, Partial<ICategory>, Partial<ICategory>>
  implements ICategoryRepository
{
  constructor() {
    super(Category);
  }

  async findBySlug(slug: string): Promise<CategoryDocument | null> {
    return Category.findOne({ slug }).exec();
  }

  async findActive(): Promise<CategoryDocument[]> {
    return Category.find({ isActive: true }).exec();
  }
  
  async findByName(name: string): Promise<CategoryDocument | null> {
  return Category.findOne({ name }).exec();
  }
}
