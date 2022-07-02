import dayjs from 'dayjs/esm';
import { IBid } from 'app/entities/bid/bid.model';
import { IProduct } from 'app/entities/product/product.model';

export interface IAuction {
  id?: number;
  bidStartTime?: dayjs.Dayjs | null;
  bidEndTime?: dayjs.Dayjs | null;
  amount?: number | null;
  ccy?: string | null;
  ids?: IBid[] | null;
  productId?: IProduct | null;
}

export class Auction implements IAuction {
  constructor(
    public id?: number,
    public bidStartTime?: dayjs.Dayjs | null,
    public bidEndTime?: dayjs.Dayjs | null,
    public amount?: number | null,
    public ccy?: string | null,
    public ids?: IBid[] | null,
    public productId?: IProduct | null
  ) {}
}

export function getAuctionIdentifier(auction: IAuction): number | undefined {
  return auction.id;
}
