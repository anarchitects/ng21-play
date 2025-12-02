import { computed, inject, signal } from '@angular/core';
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

type ProfileResource = ReturnType<AuthApi['profileResource']>;

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
  withProps(() => {
    const _authApi = inject(AuthApi);
    const _profileResource = signal<ProfileResource | null>(
      localStorage.getItem('access_token') ? _authApi.profileResource() : null
    );

    const _ensureProfileResource = () => {
      if (!_profileResource()) {
        _profileResource.set(_authApi.profileResource());
      }
      return _profileResource()!;
    };

    const _resetProfileResource = () => {
      const resource = _profileResource();
      resource?.set(undefined);
      _profileResource.set(null);
    };

    return {
      _authApi,
      _profileResource,
      _ensureProfileResource,
      _resetProfileResource,
    };
  }),
  withEntities<AuthenticatedUser>(),
  withComputed(({ _profileResource, entities }) => ({
    isLoggedIn: computed(() => {
      const resource = _profileResource();
      return !!entities().length || !!resource?.hasValue();
    }),
    authenticatedUser: computed(() => {
      const allEntities = entities();
      if (allEntities.length) {
        return allEntities[0];
      }

      const resource = _profileResource();
      return resource?.hasValue() ? resource.value() : null;
    }),
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
                store._ensureProfileResource().reload();
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
          store._resetProfileResource();
          patchState(store, removeAllEntities());
        })
      )
    ),
  }))
);
