import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBid } from '../bid.model';
import { BidService } from '../service/bid.service';

@Component({
  templateUrl: './bid-delete-dialog.component.html',
})
export class BidDeleteDialogComponent {
  bid?: IBid;

  constructor(protected bidService: BidService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bidService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
