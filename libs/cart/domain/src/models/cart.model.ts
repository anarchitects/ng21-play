import { CartItem } from './cart-item.model';

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export function calculateTotal(cart: Cart): number {
  return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
}
