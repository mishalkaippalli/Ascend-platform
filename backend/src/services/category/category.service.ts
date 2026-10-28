
import { Types } from 'mongoose';
import slugify from 'slugify';

import type {
  ICreateCategoryDTO,
  IUpdateCategoryDTO,
  IUpdateCategoryStatusDTO,
  CategoryResponseDTO,
  ActiveCategoryDTO,
} from '../../dtos/category.dto';

import type { ICategory } from '../../models/category/category.model';
import type { CategoryDocument } from '../../models/category/category.model';

import type { ICategoryRepository } from '../../interfaces/repository/ICategoryRepository';
import type { ICategoryService } from '../../interfaces/service/category/ICategoryService';

import { BadRequestError } from '../../errors/bad-request.error';
import { ConflictError } from '../../errors/conflict.error';
import { NotFoundError } from '../../errors/not-found.error';

export class CategoryService implements ICategoryService {
  constructor(
    private readonly _categoryRepository: ICategoryRepository,
  ) {}

  // Converts a Mongoose document into the admin response DTO.
  private toCategoryDTO(
    category: CategoryDocument,
  ): CategoryResponseDTO {
    return {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      ...(category.description !== undefined
        ? { description: category.description }
        : {}),
      isActive: category.isActive,
    };
  }

  private toActiveCategoryDTO(
    category: CategoryDocument,
  ): ActiveCategoryDTO {
    return {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      ...(category.description !== undefined
        ? { description: category.description }
        : {}),
    };
  }

  async createCategory(
    data: ICreateCategoryDTO,
  ): Promise<CategoryResponseDTO> {
    const name = data.name.trim();

    if (!name) {
      throw new BadRequestError('Category name is required.');
    }

    const existingCategory =
      await this._categoryRepository.findByName(name);

    if (existingCategory) {
      throw new ConflictError(
        'A category with this name already exists.',
      );
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

    // The repository saves the category and returns a Mongoose document.
    const category = await this._categoryRepository.create({
      name,
      slug,
      ...(data.description !== undefined
        ? { description: data.description.trim() }
        : {}),
    });

    // Return a DTO instead of exposing the Mongoose document.
    return this.toCategoryDTO(category);
  }

  async updateCategory(
    categoryId: Types.ObjectId,
    data: IUpdateCategoryDTO,
  ): Promise<CategoryResponseDTO> {
    const category =
      await this._categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundError('Category not found.');
    }

    const updates: Partial<ICategory> = {};

    if (data.name !== undefined) {
      const name = data.name.trim();

      if (name.length < 2) {
        throw new BadRequestError(
          'Category name must contain at least 2 characters.',
        );
      }

      const existingName =
        await this._categoryRepository.findByName(name);

      if (
        existingName &&
        !existingName._id.equals(categoryId)
      ) {
        throw new ConflictError(
          'A category with this name already exists.',
        );
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

      const existingSlug =
        await this._categoryRepository.findBySlug(slug);

      if (
        existingSlug &&
        !existingSlug._id.equals(categoryId)
      ) {
        throw new ConflictError(
          'A category with this slug already exists.',
        );
      }

      updates.name = name;
      updates.slug = slug;
    }

    if (data.description !== undefined) {
      updates.description = data.description.trim();
    }

    const updatedCategory =
      await this._categoryRepository.updateById(
        categoryId,
        updates,
      );

    if (!updatedCategory) {
      throw new NotFoundError('Category not found.');
    }

    return this.toCategoryDTO(updatedCategory);
  }

  async updateCategoryStatus(
    categoryId: Types.ObjectId,
    data: IUpdateCategoryStatusDTO,
  ): Promise<CategoryResponseDTO> {
    const category =
      await this._categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundError('Category not found.');
    }

    const updatedCategory =
      await this._categoryRepository.updateById(
        categoryId,
        { isActive: data.isActive },
      );

    if (!updatedCategory) {
      throw new NotFoundError('Category not found.');
    }

    return this.toCategoryDTO(updatedCategory);
  }

  async getActiveCategories(): Promise<ActiveCategoryDTO[]> {
    const categories =
      await this._categoryRepository.findActive();

    // Convert every database document to the public response shape.
    return categories.map((category) =>
      this.toActiveCategoryDTO(category),
    );
  }
  async getAllCategories(): Promise<CategoryResponseDTO[]> {

    const categories = await this._categoryRepository.findAll();
    
    return categories.map((category) => this.toCategoryDTO(category));
  }
}
