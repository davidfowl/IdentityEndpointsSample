import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7044'; // replace with your API URL
  private token: string | undefined;

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  // Login
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {username, password}).pipe(
      tap((response: any) => {
        localStorage.setItem('accessToken', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token);
        localStorage.setItem('expiresIn', String(Date.now() + (response.expires_in * 1000)));
      }),
      catchError(error => {
        // handle error
        console.error(error);
        return throwError(() => error);
      })
    );
  }
  // Logout
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
  }

  // Register
  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {username, password});
  }

  // Get User
  getUser(): Observable<any> {
    // Assuming that 'user' endpoint requires authentication via JWT token in the header
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(`${this.apiUrl}/users/me`, { headers: headers });
  }

  // IsAuthenticated
  isAuthenticated(): boolean {
    // get the token
    const token = localStorage.getItem('accessToken');
    // return a boolean reflecting whether or not the token is expired
    return token != null;
  }

  // Refresh Token  
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError('Refresh token not available.');
    }

    return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('accessToken', response.access_token);
          localStorage.setItem('refreshToken', response.refresh_token);
          localStorage.setItem('expiresIn', String(Date.now() + (response.expires_in * 1000)));
        })
      );
  }
}
