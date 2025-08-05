// auth.service.spec.ts
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        JwtHelperService,
        { provide: JWT_OPTIONS, useValue: {} },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token on successful login', () => {
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const mockResponse = { token: mockToken };

    service
      .login({ username: 'test', password: 'test' })
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('access_token')).toBe(mockToken);
      });

    const req = httpMock.expectOne('/api/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should clear storage on logout', () => {
    // Set some initial data
    localStorage.setItem('access_token', 'test-token');
    localStorage.setItem('currentUser', 'test-user');

    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });
});
