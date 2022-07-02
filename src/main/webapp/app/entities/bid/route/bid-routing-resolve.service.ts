import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBid, Bid } from '../bid.model';
import { BidService } from '../service/bid.service';

@Injectable({ providedIn: 'root' })
export class BidRoutingResolveService implements Resolve<IBid> {
  constructor(protected service: BidService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBid> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bid: HttpResponse<Bid>) => {
          if (bid.body) {
            return of(bid.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Bid());
  }
}
