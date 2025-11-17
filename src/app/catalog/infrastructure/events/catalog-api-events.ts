import { Product } from "@app/catalog/domain/models/product";
import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";

export const catalogApiEvents = eventGroup({
  source: 'Catalog API',
  events: {
    loadProducts: type<void>(),
    loadProductsSuccess: type<Product[]>(),
    loadProductBySlug: type<Product | null>(),
  }
})
