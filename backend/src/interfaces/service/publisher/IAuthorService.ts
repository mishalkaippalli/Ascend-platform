import {
  ICreateAuthorDTO,
  IUpdateAuthorDTO,
  IAuthorResponseDTO,
} from '../../../dtos/author.dto';

export interface IAuthorService {
  createAuthor(
    userId: string,
    data: ICreateAuthorDTO,
  ): Promise<IAuthorResponseDTO>;

  getAuthorsByPublisher(
    userId: string,
  ): Promise<IAuthorResponseDTO[]>;

  updateAuthor(
    userId: string,
    authorId: string,
    data: IUpdateAuthorDTO,
  ): Promise<IAuthorResponseDTO>;
}