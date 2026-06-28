import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Role } from '../models';

interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'access_token';

  currentUser = signal<JwtPayload | null>(this.decodeStoredToken());
  isAuthenticated = computed(() => this.currentUser() !== null);

  private decodeStoredToken(): JwtPayload | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;
    return this.decodeToken(token);
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem(this.TOKEN_KEY);
        return null;
      }
      return payload as JwtPayload;
    } catch {
      return null;
    }
  }

  login(email: string, password: string) {
    return this.http.post<{ access_token: string }>('http://localhost:3000/auth/login', { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.access_token);
        this.currentUser.set(this.decodeToken(res.access_token));
      })
    );
  }

  register(email: string, password: string, role: Role) {
    return this.http.post<{ access_token: string }>('http://localhost:3000/auth/register', { email, password, role }).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.access_token);
        this.currentUser.set(this.decodeToken(res.access_token));
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  hasRole(...roles: Role[]): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return roles.includes(user.role);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
