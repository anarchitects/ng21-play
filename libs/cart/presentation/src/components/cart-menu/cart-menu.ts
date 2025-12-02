import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapCart } from '@ng-icons/bootstrap-icons';
import { CartStore } from 'cart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-cart-menu',
  imports: [NgIcon, RouterLink],
  templateUrl: './cart-menu.html',
  styleUrl: './cart-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ bootstrapCart })],
})
export class CartMenu {
  private readonly store = inject(CartStore);
  readonly cart = this.store.cart;
}
