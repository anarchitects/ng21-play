import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { removeAllEntities, withEntities } from '@ngrx/signals/entities';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AuthApi } from 'auth/infrastructure';
import { AuthenticatedUser } from 'auth/domain';
import { pipe, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

interface AuthState {
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    _authApi: inject(AuthApi),
  })),
  withProps(({ _authApi }) => ({
    _profileResource: _authApi.profileResource(),
  })),
  withEntities<AuthenticatedUser>(),
  withComputed(({_profileResource, entities}) => ({
    isLoggedIn: computed(() => !!entities().length || _profileResource.hasValue()),
    authenticatedUser: computed(
      () =>
        entities()[0] ??
        (_profileResource.hasValue() ? _profileResource.value() : null)
    ),
  })),
  withMethods((store, router = inject(Router)) => ({
    login: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ email, password }) =>
          store._authApi.login(email, password).pipe(
            tapResponse({
              next: ({ access_token, refresh_token }) => {
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                store._profileResource.reload();
                router.navigate(['/']);
              },
              error: (error: any) => {
                patchState(store, { error: error.message || 'Login failed' });
              },
              finalize: () => patchState(store, { loading: false }),
            })
          )
        )
      )
    ),
    logout: rxMethod<void>(
      pipe(
        tap(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          store._profileResource.set(undefined)
          patchState(store, removeAllEntities());
        })
      )
    ),
  }))
);
