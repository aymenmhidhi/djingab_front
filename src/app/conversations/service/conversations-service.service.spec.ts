import { TestBed } from '@angular/core/testing';

import { ConversationsServiceService } from './conversations-service.service';

describe('ConversationsServiceService', () => {
  let service: ConversationsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
