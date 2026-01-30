import { TestBed } from '@angular/core/testing';

import { CollabService } from './collab.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('CollabService', () => {
  let service: CollabService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    service = TestBed.inject(CollabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
