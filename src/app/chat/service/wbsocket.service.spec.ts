import { TestBed } from '@angular/core/testing';

import { WbsocketService } from './wbsocket.service';

describe('WbsocketService', () => {
  let service: WbsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WbsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
