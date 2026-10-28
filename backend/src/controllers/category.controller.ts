import type { Request, Response } from 'express';
import { Types } from 'mongoose';

import type { ICategoryService } from '../interfaces/service/category/ICategoryService';
import type {
  ICreateCategoryDTO,
  IUpdateCategoryDTO,
  IUpdateCategoryStatusDTO,
} from '../dtos/category.dto';

import { BadRequestError } from '../errors/bad-request.error';
import { HttpStatusCode } from '../constants/http-status-code';
import { sendSuccessResponse } from '../utils/api-response.util';

export class CategoryController {
  constructor(
    private readonly _categoryService: ICategoryService,
  ) {}

  async createCategory(req: Request, res: Response): Promise<void> {
    // The service returns a CategoryResponseDTO.
    const category = await this._categoryService.createCategory(
      req.body as ICreateCategoryDTO,
    );

    sendSuccessResponse(
      res,
      HttpStatusCode.CREATED,
      'Category created successfully.',
      category,
    );
  }

  async getActiveCategories(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const categories = await this._categoryService.getActiveCategories();

    sendSuccessResponse(
      res,
      HttpStatusCode.OK,
      'Categories retrieved successfully.',
      categories,
    );
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    const categoryId = req.params.categoryId;

   
    if (
      typeof categoryId !== 'string' ||
      !Types.ObjectId.isValid(categoryId)
    ) {
      throw new BadRequestError('Invalid category ID.');
    }

    const category = await this._categoryService.updateCategory(
      new Types.ObjectId(categoryId),
      req.body as IUpdateCategoryDTO,
    );

    sendSuccessResponse(
      res,
      HttpStatusCode.OK,
      'Category updated successfully.',
      category,
    );
  }

  async updateCategoryStatus(
    req: Request,
    res: Response,
  ): Promise<void> {
    const categoryId = req.params.categoryId;

    if (
      typeof categoryId !== 'string' ||
      !Types.ObjectId.isValid(categoryId)
    ) {
      throw new BadRequestError('Invalid category ID.');
    }

    const category = await this._categoryService.updateCategoryStatus(
      new Types.ObjectId(categoryId),
      req.body as IUpdateCategoryStatusDTO,
    );

    sendSuccessResponse(
      res,
      HttpStatusCode.OK,
      'Category status updated successfully.',
      category,
    );
  }
  async getAllCategories(_req: Request, res: Response): Promise<void> {
  const categories = await this._categoryService.getAllCategories();

    sendSuccessResponse(
        res,
        HttpStatusCode.OK,
        'Categories retrieved successfully.',
        categories,
      );
  }
}
