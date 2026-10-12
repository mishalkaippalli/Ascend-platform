import { HydratedDocument, Model, Types } from 'mongoose';

import { IBaseRepository } from '../interfaces/repository/IBaseRepository';

export abstract class BaseRepository<
  TEntity extends object,
  TCreate extends Partial<TEntity>,
  TUpdate extends Partial<TEntity>,
> implements IBaseRepository<TEntity, TCreate, TUpdate> {
  
  protected constructor(protected readonly _model: Model<TEntity>) {}

  async create(data: TCreate): Promise<HydratedDocument<TEntity>> {
    return this._model.create(data);
  }

  async findById(
    id: Types.ObjectId,
  ): Promise<HydratedDocument<TEntity> | null> {
    return this._model.findById(id).exec();
  }

  async findAll(): Promise<HydratedDocument<TEntity>[]> {
    return this._model.find().exec();
  }

  async updateById(
    id: Types.ObjectId,
    data: TUpdate,
  ): Promise<HydratedDocument<TEntity> | null> {
    return this._model
      .findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async deleteById(
    id: Types.ObjectId,
  ): Promise<HydratedDocument<TEntity> | null> {
    return this._model.findByIdAndDelete(id).exec();
  }
}
