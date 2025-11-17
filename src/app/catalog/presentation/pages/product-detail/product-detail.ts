import { JsonPipe } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { CatalogStore } from '@app/catalog/application/state/catalog.store';

@Component({
  selector: 'app-product-detail',
  imports: [JsonPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  protected readonly store = inject(CatalogStore);
  readonly product = this.store.product;
  readonly loading = this.store.productLoading;
  readonly error = this.store.productError;
  readonly slug = input.required<string>();

  constructor() {
    effect(() => {
      this.store.setProductSlug(this.slug());
    });
  }
}
