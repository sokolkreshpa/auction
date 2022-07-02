import dayjs from 'dayjs/esm';
import { IUsers } from 'app/entities/users/users.model';
import { IAuction } from 'app/entities/auction/auction.model';

export interface IBid {
  id?: number;
  bidTime?: dayjs.Dayjs | null;
  amount?: number | null;
  ccy?: string | null;
  userId?: IUsers | null;
  auctionId?: IAuction | null;
}

export class Bid implements IBid {
  constructor(
    public id?: number,
    public bidTime?: dayjs.Dayjs | null,
    public amount?: number | null,
    public ccy?: string | null,
    public userId?: IUsers | null,
    public auctionId?: IAuction | null
  ) {}
}

export function getBidIdentifier(bid: IBid): number | undefined {
  return bid.id;
}
