import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BidComponent } from './list/bid.component';
import { BidDetailComponent } from './detail/bid-detail.component';
import { BidUpdateComponent } from './update/bid-update.component';
import { BidDeleteDialogComponent } from './delete/bid-delete-dialog.component';
import { BidRoutingModule } from './route/bid-routing.module';

@NgModule({
  imports: [SharedModule, BidRoutingModule],
  declarations: [BidComponent, BidDetailComponent, BidUpdateComponent, BidDeleteDialogComponent],
  entryComponents: [BidDeleteDialogComponent],
})
export class BidModule {}
