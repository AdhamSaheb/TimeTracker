/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NavbarService } from './navbar.service';

describe('Service: Navbar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavbarService]
    });
  });

  it('should ...', inject([NavbarService], (service: NavbarService) => {
    expect(service).toBeTruthy();
  }));
});
