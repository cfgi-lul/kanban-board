// auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../models/classes/User';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    name: 'Test User',
    roles: ['USER'],
  };

  beforeEach(() => {
    const routerSpy = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: 'Router', useValue: routerSpy }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should cache current user requests and prevent duplicates', () => {
    // First call to current()
    const firstCall = service.current();
    firstCall.subscribe();

    // Second call to current() - should use cached result
    const secondCall = service.current();
    secondCall.subscribe();

    // Third call to current() - should use cached result
    const thirdCall = service.current();
    thirdCall.subscribe();

    // Should only make one HTTP request
    const req = httpMock.expectOne('/api/users/current');
    req.flush(mockUser);

    // Verify no additional requests were made
    httpMock.verify();
  });

  it('should clear cache when user logs out', () => {
    // First call
    service.current().subscribe();
    const req1 = httpMock.expectOne('/api/users/current');
    req1.flush(mockUser);

    // Logout should clear cache
    service.logout();

    // Second call after logout should make new request
    service.current().subscribe();
    const req2 = httpMock.expectOne('/api/users/current');
    req2.flush(null);
  });

  it('should clear cache when user logs in', () => {
    // First call
    service.current().subscribe();
    const req1 = httpMock.expectOne('/api/users/current');
    req1.flush(mockUser);

    // Login should clear cache
    service.login({ username: 'test', password: 'test' }).subscribe();
    const loginReq = httpMock.expectOne('/api/api/auth/login');
    loginReq.flush({ token: 'new-token', user: mockUser });

    // Next call should make new request
    service.current().subscribe();
    const req2 = httpMock.expectOne('/api/users/current');
    req2.flush(mockUser);
  });

  it('should refresh current user when refreshCurrentUser is called', () => {
    // First call
    service.current().subscribe();
    const req1 = httpMock.expectOne('/api/users/current');
    req1.flush(mockUser);

    // Refresh should clear cache and make new request
    service.refreshCurrentUser().subscribe();
    const req2 = httpMock.expectOne('/api/users/current');
    req2.flush(mockUser);
  });
});
