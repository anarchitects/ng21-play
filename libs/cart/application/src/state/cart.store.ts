import { computed } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { removeAllEntities, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { calculateTotal, Cart, CartItem } from 'cart/domain';
import { of, pipe, switchMap, tap } from 'rxjs';

interface CartState {
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  loading: false,
  error: null,
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities<Cart>(),
  withComputed((store) => ({
    cart: computed(
      () => store.entities()[0] || { id: Math.random(), items: [], totalItems: 0, totalPrice: 0 }
    ),
  })),
  withMethods((store) => ({
    addToCart: rxMethod<CartItem>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((item) => {
          let cart: Cart = store.cart();
          cart = {
            ...cart,
            totalItems: cart.totalItems + item.quantity,
            items: [...cart.items, item],
          };
          cart.totalPrice = calculateTotal(cart);
          return of(cart).pipe(
            tapResponse({
              next: (updatedCart) => {
                patchState(store, setAllEntities([updatedCart]));
                localStorage.setItem('cart', JSON.stringify(updatedCart));
              },
              error: (error: any) => {
                patchState(store, { error: error.message || 'Failed to add item to cart' });
              },
              finalize: () => {
                patchState(store, { loading: false });
              },
            })
          );
        })
      )
    ),
    removeFromCart: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((itemId) => {
          let cart: Cart = store.cart();
          const itemToRemove = cart.items.find((item) => item.productId === itemId);
          cart = {
            ...cart,
            totalItems: cart.totalItems - (itemToRemove ? itemToRemove.quantity : 0),
            items: cart.items.filter((item) => item.productId !== itemId),
          };
          cart.totalPrice = calculateTotal(cart);
          return of(cart).pipe(
            tapResponse({
              next: (updatedCart) => {
                patchState(store, setAllEntities([updatedCart]));
                localStorage.setItem('cart', JSON.stringify(updatedCart));
              },
              error: (error: any) => {
                patchState(store, { error: error.message || 'Failed to remove item from cart' });
              },
              finalize: () => {
                patchState(store, { loading: false });
              },
            })
          );
        })
      )
    ),
    updateCartItem: rxMethod<CartItem>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((updatedItem) => {
          let cart: Cart = store.cart();
          const updatedItems = cart.items.map((item) =>
            item.productId === updatedItem.productId
              ? { ...item, quantity: updatedItem.quantity }
              : item
          );
          const updatedTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          cart = {
            ...cart,
            items: updatedItems,
            totalItems: updatedTotalItems,
          };
          cart.totalPrice = calculateTotal(cart);
          return of(cart).pipe(
            tapResponse({
              next: (updatedCart) => {
                patchState(store, setAllEntities([updatedCart]));
                localStorage.setItem('cart', JSON.stringify(updatedCart));
              },
              error: (error: any) => {
                patchState(store, { error: error.message || 'Failed to update cart item' });
              },
              finalize: () => {
                patchState(store, { loading: false });
              },
            })
          );
        })
      )
    ),
    clearCart: rxMethod(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => {
          const emptyCart: Cart = { id: 0, items: [], totalItems: 0, totalPrice: 0 };
          return of(emptyCart).pipe(
            tapResponse({
              next: () => {
                patchState(store, removeAllEntities());
                localStorage.removeItem('cart');
              },
              error: (error: any) => {
                patchState(store, { error: error.message || 'Failed to clear cart' });
              },
              finalize: () => {
                patchState(store, { loading: false });
              },
            })
          );
        })
      )
    ),
  })),
  withHooks((store) => ({
    onInit: () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cart: Cart = JSON.parse(storedCart);
        patchState(store, setAllEntities([cart]));
      }
    },
  }))
);
