import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CartStore } from 'cart/application';
import { CartItem } from 'cart/domain';
import { Product } from '@catalog/domain/models/product';

@Component({
  selector: 'lib-cart-button',
  imports: [],
  template: `<button class="btn btn--secondary" (click)="addToCart(product())">
    Add to Cart
  </button>`,
  styleUrl: './cart-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartButton {
  private readonly store = inject(CartStore);
  product = input.required<Product>();
  quantity = input<number>();

  addToCart(product: Product): void {
    const cartItem: CartItem = {
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: this.quantity() || 1,
    };
    this.store.addToCart(cartItem);
  }
}
