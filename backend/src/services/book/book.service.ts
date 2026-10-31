import slugify from 'slugify';
import { Types } from 'mongoose';

import type { ICreateBookDTO } from '../../dtos/book.dto';
import type { IBookRepository } from '../../interfaces/repository/IBookRepository';
import type { IPublisherRepository } from '../../interfaces/repository/IPublisherRepository';
import type { IBookService } from '../../interfaces/service/book/IBookService';

import { BookStatus } from '../../types/book.types';
import { PublisherVerificationStatus } from '../../types/publisher.types';

import { BadRequestError } from '../../errors/bad-request.error';
import { ForbiddenError } from '../../errors/forbidden.error';
import { NotFoundError } from '../../errors/not-found.error';

import type { BookDocument } from '../../models/book/book.model';
import type { IAuthorRepository } from '../../interfaces/repository/IAuthorRepository';

export class BookService implements IBookService {
  constructor(
    private readonly _bookRepository: IBookRepository,
    private readonly _publisherRepository: IPublisherRepository,
    private readonly _authorRepository: IAuthorRepository,
  ) {}

  async createBook(
    userId: Types.ObjectId,
    data: ICreateBookDTO,
  ): Promise<BookDocument> {

    const publisher = await this._publisherRepository.findByUserId(userId);

    if (!publisher) {
      throw new NotFoundError('Publisher profile not found.');
    }

    if (
      publisher.verification.status !== PublisherVerificationStatus.APPROVED
    ) {
      throw new ForbiddenError(
        'Your publisher account must be approved before creating books.',
      );
    }

    const title = data.title.trim();

    if (!title) {
      throw new BadRequestError('Book title is required.');
    }

    // Generate a URL-friendly slug from the book title.
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    if (!baseSlug) {
      throw new BadRequestError(
        'The book title must contain characters that can form a slug.',
      );
    }

    // Add a suffix if another book already uses this slug.
    let slug = baseSlug;
    let suffix = 2;

    while (await this._bookRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const toPaise = (amount: number, field: string): number => {
      if (
        typeof amount !== 'number' ||
        !Number.isFinite(amount) ||
        amount < 0
      ) {
        throw new BadRequestError(
          `${field} must be a valid non-negative amount.`,
        );
      }

      const paise = Math.round(amount * 100);

      if (Math.abs(amount * 100 - paise) > 1e-7) {
        throw new BadRequestError(
          `${field} cannot have more than two decimal places.`,
        );
      }

      return paise;
    };

    const priceInPaise = toPaise(data.price, 'Price');

    const salePriceInPaise =
      data.salePrice === undefined
        ? undefined
        : toPaise(data.salePrice, 'Sale price');

    // A sale price must be lower than the regular price.
    if (
      salePriceInPaise !== undefined &&
      salePriceInPaise >= priceInPaise
    ) {
      throw new BadRequestError(
        'Sale price must be lower than the regular price.',
      );
    }

    // Validate category IDs before converting them to ObjectIds.
    const categoryIds = data.categoryIds.map((categoryId) => {
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new BadRequestError(
          'One or more category IDs are invalid.',
        );
      }

      return new Types.ObjectId(categoryId);
    });

    // Validate author IDs before querying MongoDB.
    const authorIds = data.authorIds.map((authorId) => {
      if (!Types.ObjectId.isValid(authorId)) {
        throw new BadRequestError(
          'One or more author IDs are invalid.',
        );
      }

      return new Types.ObjectId(authorId);
    });

    if (authorIds.length === 0) {
      throw new BadRequestError(
        'At least one author is required.',
      );
    }

    // Prevent the same author from being associated more than once.
    const uniqueAuthorIds = new Set(
      authorIds.map((id) => id.toString()),
    );

    if (uniqueAuthorIds.size !== authorIds.length) {
      throw new BadRequestError(
        'Duplicate authors are not allowed.',
      );
    }

    // Verify that every author belongs to this publisher.
    const authors = await Promise.all(
      authorIds.map((authorId) =>
        this._authorRepository.findByIdAndPublisherId(
          authorId,
          publisher._id,
        ),
      ),
    );

    if (authors.some((author) => !author)) {
      throw new BadRequestError(
        'One or more authors are invalid or do not belong to your publisher account.',
      );
    }

    return this._bookRepository.create({
      publisherId: publisher._id,
      title,
      slug,
      description: data.description.trim(),
      authorIds,
      categoryIds,
      priceInPaise,
      ...(salePriceInPaise !== undefined
        ? { salePriceInPaise }
        : {}),
      language: data.language.trim().toLowerCase(),
      ...(data.previewText !== undefined
        ? { previewText: data.previewText.trim() }
        : {}),
      status: BookStatus.DRAFT,
    });
  }
}