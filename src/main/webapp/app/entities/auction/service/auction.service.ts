import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuction, getAuctionIdentifier } from '../auction.model';

export type EntityResponseType = HttpResponse<IAuction>;
export type EntityArrayResponseType = HttpResponse<IAuction[]>;

@Injectable({ providedIn: 'root' })
export class AuctionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/auctions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(auction: IAuction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(auction);
    return this.http
      .post<IAuction>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(auction: IAuction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(auction);
    return this.http
      .put<IAuction>(`${this.resourceUrl}/${getAuctionIdentifier(auction) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(auction: IAuction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(auction);
    return this.http
      .patch<IAuction>(`${this.resourceUrl}/${getAuctionIdentifier(auction) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAuction>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAuction[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAuctionToCollectionIfMissing(auctionCollection: IAuction[], ...auctionsToCheck: (IAuction | null | undefined)[]): IAuction[] {
    const auctions: IAuction[] = auctionsToCheck.filter(isPresent);
    if (auctions.length > 0) {
      const auctionCollectionIdentifiers = auctionCollection.map(auctionItem => getAuctionIdentifier(auctionItem)!);
      const auctionsToAdd = auctions.filter(auctionItem => {
        const auctionIdentifier = getAuctionIdentifier(auctionItem);
        if (auctionIdentifier == null || auctionCollectionIdentifiers.includes(auctionIdentifier)) {
          return false;
        }
        auctionCollectionIdentifiers.push(auctionIdentifier);
        return true;
      });
      return [...auctionsToAdd, ...auctionCollection];
    }
    return auctionCollection;
  }

  protected convertDateFromClient(auction: IAuction): IAuction {
    return Object.assign({}, auction, {
      bidStartTime: auction.bidStartTime?.isValid() ? auction.bidStartTime.toJSON() : undefined,
      bidEndTime: auction.bidEndTime?.isValid() ? auction.bidEndTime.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.bidStartTime = res.body.bidStartTime ? dayjs(res.body.bidStartTime) : undefined;
      res.body.bidEndTime = res.body.bidEndTime ? dayjs(res.body.bidEndTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((auction: IAuction) => {
        auction.bidStartTime = auction.bidStartTime ? dayjs(auction.bidStartTime) : undefined;
        auction.bidEndTime = auction.bidEndTime ? dayjs(auction.bidEndTime) : undefined;
      });
    }
    return res;
  }
}
