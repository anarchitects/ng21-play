import { computed, inject } from "@angular/core";
import { Category } from "@app/catalog/domain/models/category";
import { Product } from "@app/catalog/domain/models/product";
import { CatalogApi } from "@app/catalog/infrastructure/http/catalog-api";
import { patchState, signalStore, type, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
import { withEntities } from "@ngrx/signals/entities";

interface CatalogState {
  limit: number;
  offset: number;
  total: number;
  selectedProductId: number;
  productSlug: string;
}

const initialState: CatalogState = {
  limit: 15,
  offset: 0,
  total: 0,
  selectedProductId: 0,
  productSlug: '',
}

export const CatalogStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities({ entity: type<Product>(), collection: 'products' }),
  withEntities({ entity: type<Category>(), collection: 'categories' }),
  withProps(() => ({ _catalogApi: inject(CatalogApi) })),
  withProps(({ _catalogApi, limit, offset }) => ({
    _products: _catalogApi.productsResource(limit, offset),
  })),
  withProps(({ _catalogApi, productSlug }) => ({
    _product: _catalogApi.productSlugResource(productSlug),
  })),
  withComputed(({ _products, _product }) => ({
    products: computed(() => _products.hasValue() ? _products.value() : []),
    productsLoading: computed(() => _products.isLoading()),
    productsError: computed(() => _products.error()),
    product: computed(() => _product.hasValue() ? _product.value() : null),
    productLoading: computed(() => _product.isLoading()),
    productError: computed(() => _product.error()),
  })),
  withMethods((store) => ({
    nextPage: () => {
      patchState(store, (state) => ({ offset: state.offset + state.limit }));
    },
    previousPage: () => {
      patchState(store, (state) => ({ offset: Math.max(0, state.offset - state.limit) }));
    },
    selectProduct: (productId: number) => {
      patchState(store, { selectedProductId: productId });
    },
    setProductSlug: (slug: string) => {
      patchState(store, { productSlug: slug });
    }
  })),
);
