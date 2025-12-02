import { JsonPipe } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogStore } from '@app/catalog/application/state/catalog.store';
import { CartButton } from 'cart/presentation';

@Component({
  selector: 'app-product-detail',
  imports: [JsonPipe, CartButton, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  protected readonly store = inject(CatalogStore);
  readonly product = this.store.product;
  readonly loading = this.store.productLoading;
  readonly error = this.store.productError;
  readonly slug = input.required<string>();
  quantity = 1
  selectedImage = 0;

  constructor() {
    effect(() => {
      this.store.setProductSlug(this.slug());
    });
  }

  selectImage(number: number): void {
    this.selectedImage = number;
  }
}
