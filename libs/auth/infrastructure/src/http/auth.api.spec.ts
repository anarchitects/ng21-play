import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthApi } from './auth.api';

describe('AuthApi', () => {
  let service: AuthApi;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthApi);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('login', () => {
    it('should return access and refresh tokens', () => {
      const mockResponse = {
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
      };

      service.login('test@example.com', 'password123').subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpController.expectOne('https://api.escuelajs.co/api/v1/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });

      req.flush(mockResponse);
    });
  });
});
