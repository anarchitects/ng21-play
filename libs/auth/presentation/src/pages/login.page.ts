import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, Field, required, email, submit } from '@angular/forms/signals';
import { AuthStore } from 'auth/application';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'lib-login',
  imports: [Field],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly store = inject(AuthStore);
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  readonly loginForm = form(this.loginModel, f => {
    required(f.email, { message: 'Email is required' });
    email(f.email, { message: 'Invalid email format' });
    required(f.password, { message: 'Password is required' });
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.loginForm, async () => {
      this.store.login(this.loginModel());
    });
  }
}
