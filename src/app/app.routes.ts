import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@app/catalog/presentation/pages/routes').then((m) => m.CATALOG_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('auth/presentation').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'cart',
    loadChildren: () => import('cart/presentation').then((m) => m.CART_ROUTES),
  }
];
