import { Routes } from "@angular/router";

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./products/products').then((m) => m.Products),
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./product-detail/product-detail').then((m) => m.ProductDetail),
  },
];
