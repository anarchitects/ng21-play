import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CartComponent } from 'cart/presentation';

@Component({
  selector: 'lib-cart-page',
  imports: [CartComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {}
