import { httpResource } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { Category } from '@app/catalog/domain/models/category';
import { Product } from '@app/catalog/domain/models/product';

@Injectable({
  providedIn: 'root',
})
export class CatalogApi {
  private baseUrl = 'https://api.escuelajs.co/api/v1';

  productsResource(limit: Signal<number>, offset: Signal<number>) {
    return httpResource<Product[]>(() => ({
      url: `${this.baseUrl}/products`,
      method: 'GET',
      params: {
        limit: limit(),
        offset: offset(),
      },
      defaultValue: [],
    }));
  }

  productResource(id: Signal<number>) {
    return httpResource<Product>(() => ({
      url: `${this.baseUrl}/products/${id()}`,
      method: 'GET',
      defaultValue: null,
    }));
  }

  productSlugResource(slug: Signal<string | undefined>) {
    return httpResource<Product>(() => ({
      url: `${this.baseUrl}/products/slug/${slug()}`,
      method: 'GET',
      defaultValue: null,
    }));
  }

  categoriesResource() {
    return httpResource<Category[]>(() => ({
      url: `${this.baseUrl}/categories`,
      method: 'GET',
    }));
  }
}
