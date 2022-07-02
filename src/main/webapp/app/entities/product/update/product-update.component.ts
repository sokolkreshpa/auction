import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProduct, Product } from '../product.model';
import { ProductService } from '../service/product.service';
import { IProductCategory } from 'app/entities/product-category/product-category.model';
import { ProductCategoryService } from 'app/entities/product-category/service/product-category.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;

  productCategoriesSharedCollection: IProductCategory[] = [];
  locationsSharedCollection: ILocation[] = [];

  editForm = this.fb.group({
    id: [],
    productname: [],
    productSpecification: [],
    actualCost: [],
    ccy: [],
    creationDate: [],
    productCategoryId: [],
    locationId: [],
  });

  constructor(
    protected productService: ProductService,
    protected productCategoryService: ProductCategoryService,
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      if (product.id === undefined) {
        const today = dayjs().startOf('day');
        product.creationDate = today;
      }

      this.updateForm(product);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  trackProductCategoryById(_index: number, item: IProductCategory): number {
    return item.id!;
  }

  trackLocationById(_index: number, item: ILocation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
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

  protected updateForm(product: IProduct): void {
    this.editForm.patchValue({
      id: product.id,
      productname: product.productname,
      productSpecification: product.productSpecification,
      actualCost: product.actualCost,
      ccy: product.ccy,
      creationDate: product.creationDate ? product.creationDate.format(DATE_TIME_FORMAT) : null,
      productCategoryId: product.productCategoryId,
      locationId: product.locationId,
    });

    this.productCategoriesSharedCollection = this.productCategoryService.addProductCategoryToCollectionIfMissing(
      this.productCategoriesSharedCollection,
      product.productCategoryId
    );
    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing(
      this.locationsSharedCollection,
      product.locationId
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productCategoryService
      .query()
      .pipe(map((res: HttpResponse<IProductCategory[]>) => res.body ?? []))
      .pipe(
        map((productCategories: IProductCategory[]) =>
          this.productCategoryService.addProductCategoryToCollectionIfMissing(
            productCategories,
            this.editForm.get('productCategoryId')!.value
          )
        )
      )
      .subscribe((productCategories: IProductCategory[]) => (this.productCategoriesSharedCollection = productCategories));

    this.locationService
      .query()
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing(locations, this.editForm.get('locationId')!.value)
        )
      )
      .subscribe((locations: ILocation[]) => (this.locationsSharedCollection = locations));
  }

  protected createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      productname: this.editForm.get(['productname'])!.value,
      productSpecification: this.editForm.get(['productSpecification'])!.value,
      actualCost: this.editForm.get(['actualCost'])!.value,
      ccy: this.editForm.get(['ccy'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value
        ? dayjs(this.editForm.get(['creationDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      productCategoryId: this.editForm.get(['productCategoryId'])!.value,
      locationId: this.editForm.get(['locationId'])!.value,
    };
  }
}
