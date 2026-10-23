import type { Request, Response } from 'express';

import type { ICategoryService } from '../interfaces/service/category/ICategoryService';
import type { ICreateCategoryDTO } from '../dtos/category.dto';

import { HttpStatusCode } from '../constants/http-status-code';
import { sendSuccessResponse } from '../utils/api-response.util';

export class CategoryController {
  constructor(
    private readonly _categoryService: ICategoryService,
  ) {}

  async createCategory(req: Request, res: Response): Promise<void> {
    const category = await this._categoryService.createCategory(
      req.body as ICreateCategoryDTO,
    );

    sendSuccessResponse(
      res,
      HttpStatusCode.CREATED,
      'Category created successfully.',
      {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: category.isActive,
      },
    );
  }

    async getActiveCategories(_req: Request, res: Response): Promise<void> {
        const categories = await this._categoryService.getActiveCategories();

        const data = categories.map((category) => ({
            id: category._id.toString(),
            name: category.name,
            slug: category.slug,
            description: category.description,
        }));

        sendSuccessResponse(
            res,
            HttpStatusCode.OK,
            'Categories retrieved successfully.',
            data,
    );
    }

}