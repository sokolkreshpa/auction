import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBid } from '../bid.model';
import { BidService } from '../service/bid.service';
import { BidDeleteDialogComponent } from '../delete/bid-delete-dialog.component';

@Component({
  selector: 'jhi-bid',
  templateUrl: './bid.component.html',
})
export class BidComponent implements OnInit {
  bids?: IBid[];
  isLoading = false;

  constructor(protected bidService: BidService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.bidService.query().subscribe({
      next: (res: HttpResponse<IBid[]>) => {
        this.isLoading = false;
        this.bids = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IBid): number {
    return item.id!;
  }

  delete(bid: IBid): void {
    const modalRef = this.modalService.open(BidDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bid = bid;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
