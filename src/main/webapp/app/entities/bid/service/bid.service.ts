import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBid, getBidIdentifier } from '../bid.model';

export type EntityResponseType = HttpResponse<IBid>;
export type EntityArrayResponseType = HttpResponse<IBid[]>;

@Injectable({ providedIn: 'root' })
export class BidService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bids');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bid: IBid): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bid);
    return this.http
      .post<IBid>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bid: IBid): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bid);
    return this.http
      .put<IBid>(`${this.resourceUrl}/${getBidIdentifier(bid) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(bid: IBid): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bid);
    return this.http
      .patch<IBid>(`${this.resourceUrl}/${getBidIdentifier(bid) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBid>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBid[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBidToCollectionIfMissing(bidCollection: IBid[], ...bidsToCheck: (IBid | null | undefined)[]): IBid[] {
    const bids: IBid[] = bidsToCheck.filter(isPresent);
    if (bids.length > 0) {
      const bidCollectionIdentifiers = bidCollection.map(bidItem => getBidIdentifier(bidItem)!);
      const bidsToAdd = bids.filter(bidItem => {
        const bidIdentifier = getBidIdentifier(bidItem);
        if (bidIdentifier == null || bidCollectionIdentifiers.includes(bidIdentifier)) {
          return false;
        }
        bidCollectionIdentifiers.push(bidIdentifier);
        return true;
      });
      return [...bidsToAdd, ...bidCollection];
    }
    return bidCollection;
  }

  protected convertDateFromClient(bid: IBid): IBid {
    return Object.assign({}, bid, {
      bidTime: bid.bidTime?.isValid() ? bid.bidTime.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.bidTime = res.body.bidTime ? dayjs(res.body.bidTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bid: IBid) => {
        bid.bidTime = bid.bidTime ? dayjs(bid.bidTime) : undefined;
      });
    }
    return res;
  }
}
