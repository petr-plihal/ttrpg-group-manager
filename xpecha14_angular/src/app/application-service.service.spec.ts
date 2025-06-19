import { TestBed } from '@angular/core/testing';

import { ApplicationServiceService } from './application-service.service';

describe('ApplicationServiceService', () => {
  let service: ApplicationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
