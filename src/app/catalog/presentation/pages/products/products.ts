import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogStore } from '@app/catalog/application/state/catalog.store';

@Component({
  selector: 'app-products',
  imports: [JsonPipe, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  protected readonly store = inject(CatalogStore);
  readonly products = this.store.products;
  readonly loading = this.store.productsLoading;
  readonly error = this.store.productsError;

}
