import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAuction, Auction } from '../auction.model';
import { AuctionService } from '../service/auction.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

@Component({
  selector: 'jhi-auction-update',
  templateUrl: './auction-update.component.html',
})
export class AuctionUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    bidStartTime: [],
    bidEndTime: [],
    amount: [],
    ccy: [],
    productId: [],
  });

  constructor(
    protected auctionService: AuctionService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ auction }) => {
      if (auction.id === undefined) {
        const today = dayjs().startOf('day');
        auction.bidStartTime = today;
        auction.bidEndTime = today;
      }

      this.updateForm(auction);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const auction = this.createFromForm();
    if (auction.id !== undefined) {
      this.subscribeToSaveResponse(this.auctionService.update(auction));
    } else {
      this.subscribeToSaveResponse(this.auctionService.create(auction));
    }
  }

  trackProductById(_index: number, item: IProduct): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAuction>>): void {
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

  protected updateForm(auction: IAuction): void {
    this.editForm.patchValue({
      id: auction.id,
      bidStartTime: auction.bidStartTime ? auction.bidStartTime.format(DATE_TIME_FORMAT) : null,
      bidEndTime: auction.bidEndTime ? auction.bidEndTime.format(DATE_TIME_FORMAT) : null,
      amount: auction.amount,
      ccy: auction.ccy,
      productId: auction.productId,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(this.productsSharedCollection, auction.productId);
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('productId')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  protected createFromForm(): IAuction {
    return {
      ...new Auction(),
      id: this.editForm.get(['id'])!.value,
      bidStartTime: this.editForm.get(['bidStartTime'])!.value
        ? dayjs(this.editForm.get(['bidStartTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      bidEndTime: this.editForm.get(['bidEndTime'])!.value ? dayjs(this.editForm.get(['bidEndTime'])!.value, DATE_TIME_FORMAT) : undefined,
      amount: this.editForm.get(['amount'])!.value,
      ccy: this.editForm.get(['ccy'])!.value,
      productId: this.editForm.get(['productId'])!.value,
    };
  }
}
