import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IBid, Bid } from '../bid.model';
import { BidService } from '../service/bid.service';
import { IAuction } from 'app/entities/auction/auction.model';
import { AuctionService } from 'app/entities/auction/service/auction.service';

@Component({
  selector: 'jhi-bid-update',
  templateUrl: './bid-update.component.html',
})
export class BidUpdateComponent implements OnInit {
  isSaving = false;

  auctionsSharedCollection: IAuction[] = [];

  editForm = this.fb.group({
    id: [],
    bidTime: [],
    amount: [],
    ccy: [],
    auctionId: [],
  });

  constructor(
    protected bidService: BidService,
    protected auctionService: AuctionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bid }) => {
      if (bid.id === undefined) {
        const today = dayjs().startOf('day');
        bid.bidTime = today;
      }

      this.updateForm(bid);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bid = this.createFromForm();
    if (bid.id !== undefined) {
      this.subscribeToSaveResponse(this.bidService.update(bid));
    } else {
      this.subscribeToSaveResponse(this.bidService.create(bid));
    }
  }

  trackAuctionById(_index: number, item: IAuction): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBid>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bid: IBid): void {
    this.editForm.patchValue({
      id: bid.id,
      bidTime: bid.bidTime ? bid.bidTime.format(DATE_TIME_FORMAT) : null,
      amount: bid.amount,
      ccy: bid.ccy,
      auctionId: bid.auctionId,
    });

    this.auctionsSharedCollection = this.auctionService.addAuctionToCollectionIfMissing(this.auctionsSharedCollection, bid.auctionId);
  }

  protected loadRelationshipsOptions(): void {
    this.auctionService
      .query()
      .pipe(map((res: HttpResponse<IAuction[]>) => res.body ?? []))
      .pipe(
        map((auctions: IAuction[]) => this.auctionService.addAuctionToCollectionIfMissing(auctions, this.editForm.get('auctionId')!.value))
      )
      .subscribe((auctions: IAuction[]) => (this.auctionsSharedCollection = auctions));
  }

  protected createFromForm(): IBid {
    return {
      ...new Bid(),
      id: this.editForm.get(['id'])!.value,
      bidTime: this.editForm.get(['bidTime'])!.value ? dayjs(this.editForm.get(['bidTime'])!.value, DATE_TIME_FORMAT) : undefined,
      amount: this.editForm.get(['amount'])!.value,
      ccy: this.editForm.get(['ccy'])!.value,
      auctionId: this.editForm.get(['auctionId'])!.value,
    };
  }
}
