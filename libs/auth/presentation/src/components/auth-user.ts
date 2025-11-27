import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapBoxArrowDownRight, bootstrapBoxArrowInLeft, bootstrapBoxArrowRight, bootstrapPerson } from '@ng-icons/bootstrap-icons';
import { AuthStore } from 'auth/application';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-auth-user',
  imports: [NgIcon, RouterLink],
  templateUrl: './auth-user.html',
  styleUrl: './auth-user.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ bootstrapPerson, bootstrapBoxArrowRight, bootstrapBoxArrowInLeft })],
})
export class AuthUser {
  private readonly store = inject(AuthStore);
  readonly authUser = this.store.authenticatedUser;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  logout(): void {
    this.store.logout();
  }
}
