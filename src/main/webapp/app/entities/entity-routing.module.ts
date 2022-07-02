import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product',
        data: { pageTitle: 'auctionApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'product-category',
        data: { pageTitle: 'auctionApp.productCategory.home.title' },
        loadChildren: () => import('./product-category/product-category.module').then(m => m.ProductCategoryModule),
      },
      {
        path: 'location',
        data: { pageTitle: 'auctionApp.location.home.title' },
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'auction',
        data: { pageTitle: 'auctionApp.auction.home.title' },
        loadChildren: () => import('./auction/auction.module').then(m => m.AuctionModule),
      },
      {
        path: 'bid',
        data: { pageTitle: 'auctionApp.bid.home.title' },
        loadChildren: () => import('./bid/bid.module').then(m => m.BidModule),
      },
      {
        path: 'users',
        data: { pageTitle: 'auctionApp.users.home.title' },
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
