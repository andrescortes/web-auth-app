import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { AuthStatus, CheckTokenResponse, LoginResponse, LoginResponseRegister, User } from '../interfaces';
import { environment } from 'src/environments/environment';
import { LoginRequest } from '../interfaces/login-request.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  private _currentUser = signal<User | null>(null);
  private httpClient = inject(HttpClient);
  private readonly baseUrl: string = environment.baseUrl;

  public authStatus = computed(() => this._authStatus());
  public currentUser = computed(() => this._currentUser());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body: LoginRequest = { email, password };
    return this.httpClient.post<LoginResponse>(url, body)
      .pipe(
        map(({ user, token }) => this.updateAuthStatus(user, token)),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error.message);
        }),
      );
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/register`;
    const body = { name, email, password };
    return this.httpClient.post<LoginResponseRegister>(url, body)
      .pipe(
        map(({ user, token }) => this.updateAuthStatus(user, token)),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error.message);
        }),
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if (!token) {
      this._authStatus.set(AuthStatus.notAuthenticated);
      return of(false);
    }
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<CheckTokenResponse>(url, { headers: header })
      .pipe(
        map(({ user, token }) => this.updateAuthStatus(user, token)),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        }),
      )
  }

  private updateAuthStatus(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }

  logout(): void {
    this._authStatus.set(AuthStatus.notAuthenticated);
    this._currentUser.set(null);
    localStorage.removeItem('token');
  }
}
