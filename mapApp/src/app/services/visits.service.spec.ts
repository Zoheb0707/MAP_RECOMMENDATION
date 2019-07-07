import { TestBed } from '@angular/core/testing';

import { VisitsService } from './visits.service';

describe('VisitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisitsService = TestBed.get(VisitsService);
    expect(service).toBeTruthy();
  });
});
