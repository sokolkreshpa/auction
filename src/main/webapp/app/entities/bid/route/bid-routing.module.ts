import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BidComponent } from '../list/bid.component';
import { BidDetailComponent } from '../detail/bid-detail.component';
import { BidUpdateComponent } from '../update/bid-update.component';
import { BidRoutingResolveService } from './bid-routing-resolve.service';

const bidRoute: Routes = [
  {
    path: '',
    component: BidComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BidDetailComponent,
    resolve: {
      bid: BidRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BidUpdateComponent,
    resolve: {
      bid: BidRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BidUpdateComponent,
    resolve: {
      bid: BidRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bidRoute)],
  exports: [RouterModule],
})
export class BidRoutingModule {}
