import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthenticatedUser } from 'auth/domain';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private baseUrl = 'https://api.escuelajs.co/api/v1';
  private http = inject(HttpClient);

  login(email: string, password: string) {
    return this.http.post<{ access_token: string; refresh_token: string }>(
      `${this.baseUrl}/auth/login`,
      {
        email,
        password,
      }
    );
  }

  profileResource() {
    return httpResource<AuthenticatedUser>(() => ({
      url: `${this.baseUrl}/auth/profile`,
      method: 'GET',
      defaultValue: null,
    }));
  }

  refreshToken(refreshToken: string) {
    return this.http.post<{ access_token: string; refresh_token: string }>(
      `${this.baseUrl}/auth/refresh-token`,
      {
        refreshToken,
      }
    );
  }
}
