import { IProduct } from 'app/entities/product/product.model';

export interface IProductCategory {
  id?: number;
  categoryDescription?: string | null;
  ids?: IProduct[] | null;
}

export class ProductCategory implements IProductCategory {
  constructor(public id?: number, public categoryDescription?: string | null, public ids?: IProduct[] | null) {}
}

export function getProductCategoryIdentifier(productCategory: IProductCategory): number | undefined {
  return productCategory.id;
}
