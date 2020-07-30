/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TokenInterceptorService } from './TokenInterceptor.service';

describe('Service: TokenInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenInterceptorService]
    });
  });

  it('should ...', inject([TokenInterceptorService], (service: TokenInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
