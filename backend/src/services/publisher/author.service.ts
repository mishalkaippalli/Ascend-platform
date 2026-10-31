import { Types } from 'mongoose';
import slugify from 'slugify';

import { IAuthorService } from '../../interfaces/service/publisher/IAuthorService';
import { IAuthorRepository } from '../../interfaces/repository/IAuthorRepository';
import { IPublisherRepository } from '../../interfaces/repository/IPublisherRepository';

import {
  ICreateAuthorDTO,
  IUpdateAuthorDTO,
  IAuthorResponseDTO,
} from '../../dtos/author.dto';

import { PublisherVerificationStatus } from '../../types/publisher.types';

import { BadRequestError } from '../../errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';
import { ConflictError } from '../../errors/conflict.error';

export class AuthorService implements IAuthorService {
  constructor(
    private readonly _authorRepository: IAuthorRepository,
    private readonly _publisherRepository: IPublisherRepository,
  ) {}

  private async getApprovedPublisher(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('User ID is not valid');
    }

    const publisher = await this._publisherRepository.findByUserId(
      new Types.ObjectId(userId),
    );

    if (!publisher) {
      throw new NotFoundError('Publisher application not found');
    }

    if (
      publisher.verification.status !==
      PublisherVerificationStatus.APPROVED
    ) {
      throw new ConflictError(
        'Your publisher account must be approved to manage authors',
      );
    }

    return publisher;
  }

  private async generateUniqueSlug(
    publisherId: Types.ObjectId,
    name: string,
    currentAuthorId?: Types.ObjectId,
  ): Promise<string> {
    const baseSlug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    if (!baseSlug) {
      throw new BadRequestError('Author name cannot generate a valid slug');
    }

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingAuthor =
        await this._authorRepository.findByPublisherIdAndSlug(
          publisherId,
          slug,
        );

      // Allow the current author to retain its existing slug.
      if (
        !existingAuthor ||
        existingAuthor._id.equals(currentAuthorId)
      ) {
        return slug;
      }

      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  // Convert the database document into the API response DTO.
  private toAuthorResponse(
    author: Awaited<ReturnType<IAuthorRepository['findById']>>,
  ): IAuthorResponseDTO {
    if (!author) {
      throw new NotFoundError('Author not found');
    }

    return {
      id: author._id.toString(),
      name: author.name,
      slug: author.slug,

      ...(author.origin !== undefined && {
        origin: author.origin,
      }),

        ...(author.profileImage?.url && {
        profileImage: {
            url: author.profileImage.url,
        },
        }),

      ...(author.bio !== undefined && {
        bio: author.bio,
      }),

      createdAt: author.createdAt,
      updatedAt: author.updatedAt,
    };
  }

  async createAuthor(
    userId: string,
    data: ICreateAuthorDTO,
  ): Promise<IAuthorResponseDTO> {
    const publisher = await this.getApprovedPublisher(userId);

    const slug = await this.generateUniqueSlug(
      publisher._id,
      data.name,
    );

    const author = await this._authorRepository.create({
      publisherId: publisher._id,
      name: data.name.trim(),
      slug,
      ...(data.origin !== undefined && {
        origin: data.origin.trim(),
      }),
      ...(data.profileImage && {
        profileImage: data.profileImage,
      }),
      ...(data.bio !== undefined && {
        bio: data.bio.trim(),
      }),
    });

    return this.toAuthorResponse(author);
  }

  async getAuthorsByPublisher(
    userId: string,
  ): Promise<IAuthorResponseDTO[]> {
    const publisher = await this.getApprovedPublisher(userId);

    const authors = await this._authorRepository.findByPublisherId(
      publisher._id,
    );

    return authors.map((author) => this.toAuthorResponse(author));
  }

  async updateAuthor(
    userId: string,
    authorId: string,
    data: IUpdateAuthorDTO,
  ): Promise<IAuthorResponseDTO> {
    const publisher = await this.getApprovedPublisher(userId);

    if (!Types.ObjectId.isValid(authorId)) {
      throw new BadRequestError('Author ID is not valid');
    }

    const authorObjectId = new Types.ObjectId(authorId);

    const existingAuthor =
      await this._authorRepository.findByIdAndPublisherId(
        authorObjectId,
        publisher._id,
      );

    if (!existingAuthor) {
      throw new NotFoundError('Author not found');
    }

    const updateData: IUpdateAuthorDTO & { slug?: string } = {
      ...data,
    };

    // Regenerate the slug only when the author name changes.
    if (data.name !== undefined) {
      const trimmedName = data.name.trim();

      updateData.name = trimmedName;
      updateData.slug = await this.generateUniqueSlug(
        publisher._id,
        trimmedName,
        existingAuthor._id,
      );
    }

    const updatedAuthor = await this._authorRepository.updateById(
      authorObjectId,
      updateData,
    );

    if (!updatedAuthor) {
      throw new NotFoundError('Author not found');
    }

    return this.toAuthorResponse(updatedAuthor);
  }
}