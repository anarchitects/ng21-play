import { TestBed } from '@angular/core/testing';

import { CatalogApi } from './catalog-api';

describe('CatalogApi', () => {
  let service: CatalogApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
