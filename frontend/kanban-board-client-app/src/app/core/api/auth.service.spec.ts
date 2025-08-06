// auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../models/classes/User';
import { JwtHelperService } from '@auth0/angular-jwt';

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

    const jwtHelperSpy = {
      isTokenExpired: jest.fn().mockReturnValue(false),
      decodeToken: jest.fn().mockReturnValue({ sub: 'test' }),
      getTokenExpirationDate: jest
        .fn()
        .mockReturnValue(new Date(Date.now() + 3600000)),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: 'Router', useValue: routerSpy },
        { provide: JwtHelperService, useValue: jwtHelperSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should make HTTP request to get current user', () => {
    // Call current() method
    service.current().subscribe();

    // Should make HTTP request
    const req = httpMock.expectOne('/api/users/current');
    req.flush(mockUser);

    // Verify no additional requests were made
    httpMock.verify();
  });

  it('should handle login request', () => {
    const loginData = { username: 'test', password: 'test' };
    const mockResponse = { token: 'test-token', user: mockUser };

    service.login(loginData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should refresh current user', () => {
    service.refreshCurrentUser().subscribe();

    const req = httpMock.expectOne('/api/users/current');
    req.flush(mockUser);
  });
});
