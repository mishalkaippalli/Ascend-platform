import slugify from 'slugify';

import type { ICategoryService } from '../../interfaces/service/category/ICategoryService';
import type { ICategoryRepository } from '../../interfaces/repository/ICategoryRepository';
import type { CategoryDocument } from '../../models/category/category.model';
import type { ICreateCategoryDTO } from '../../dtos/category.dto';

import { BadRequestError } from '../../errors/bad-request.error';
import { ConflictError } from '../../errors/conflict.error';

export class CategoryService implements ICategoryService {
  constructor(private readonly _categoryRepository: ICategoryRepository) {}

  async createCategory(data: ICreateCategoryDTO): Promise<CategoryDocument> {
    const name = data.name.trim();

    if (!name) {
      throw new BadRequestError('Category name is required.');
    }

    const existingCategory = await this._categoryRepository.findByName(name);

    if (existingCategory) {
      throw new ConflictError('A category with this name already exists.');
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    if (!slug) {
      throw new BadRequestError(
        'The category name must contain characters that can form a slug.',
      );
    }

    // Save the generated slug alongside the category data.
    return this._categoryRepository.create({
      name,
      slug,
      ...(data.description !== undefined
        ? { description: data.description.trim() }
        : {}),
    });
  }

    async getActiveCategories(): Promise<CategoryDocument[]> {
    return this._categoryRepository.findActive();
    }

}
