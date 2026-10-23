import { IBaseRepository } from "./IBaseRepository";
import { ICategory, CategoryDocument } from "../../models/category/category.model";

export interface ICategoryRepository 
    extends IBaseRepository<ICategory, Partial<ICategory>, Partial<ICategory>>{
        findBySlug(slug: string): Promise<CategoryDocument | null>
        findActive(): Promise<CategoryDocument[]>
        findByName(name: string): Promise<CategoryDocument | null>;
    }