import dayjs from 'dayjs/esm';
import { IAuction } from 'app/entities/auction/auction.model';
import { IProductCategory } from 'app/entities/product-category/product-category.model';
import { ILocation } from 'app/entities/location/location.model';

export interface IProduct {
  id?: number;
  productname?: string | null;
  productSpecification?: string | null;
  actualCost?: number | null;
  ccy?: string | null;
  creationDate?: dayjs.Dayjs | null;
  ids?: IAuction[] | null;
  productCategoryId?: IProductCategory | null;
  locationId?: ILocation | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public productname?: string | null,
    public productSpecification?: string | null,
    public actualCost?: number | null,
    public ccy?: string | null,
    public creationDate?: dayjs.Dayjs | null,
    public ids?: IAuction[] | null,
    public productCategoryId?: IProductCategory | null,
    public locationId?: ILocation | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
