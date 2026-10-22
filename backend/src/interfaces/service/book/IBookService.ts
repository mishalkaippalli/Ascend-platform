import type { Types } from 'mongoose';

import type { ICreateBookDTO } from '../../../dtos/book.dto';
import type { BookDocument } from '../../../models/book/book.model';

export interface IBookService {
  createBook(
    userId: Types.ObjectId,
    data: ICreateBookDTO,
  ): Promise<BookDocument>;
}