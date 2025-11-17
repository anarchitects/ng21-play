import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { bootstrapCart, bootstrapHouseDoor, bootstrapPerson } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';

interface NavLink {
  label: string;
  path: string;
  queryParams?: Params;
  isHighlighted?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ bootstrapCart, bootstrapPerson, bootstrapHouseDoor })],
})
export class Header {
  readonly menuId = 'primary-navigation';
  readonly menuOpen = signal(false);
  readonly navLinks: readonly NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'New Arrivals', path: '/products', queryParams: { offset: 0, limit: 12 } },
    { label: 'Collections', path: '/products', queryParams: { categoryId: 3, limit: 12 } },
    { label: 'Sale', path: '/products', queryParams: { price_min: 0, price_max: 60 }, isHighlighted: true },
  ];
  readonly menuToggleLabel = computed(() =>
    this.menuOpen() ? 'Close navigation menu' : 'Open navigation menu'
  );

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

}
