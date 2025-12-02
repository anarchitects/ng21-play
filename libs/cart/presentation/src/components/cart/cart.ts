import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartStore } from 'cart/application';

@Component({
  selector: 'lib-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private readonly store = inject(CartStore);
  readonly cart = this.store.cart;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
}
