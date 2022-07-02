import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBid } from '../bid.model';

@Component({
  selector: 'jhi-bid-detail',
  templateUrl: './bid-detail.component.html',
})
export class BidDetailComponent implements OnInit {
  bid: IBid | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bid }) => {
      this.bid = bid;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
