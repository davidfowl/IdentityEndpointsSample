import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.authService.getToken(); 
    if (token) {
      if (this.isTokenExpired()) {
        if (!this.isRefreshing) {
          this.refreshToken();
        }
        request = this.addToken(request, this.refreshTokenSubject.getValue());
      } else {
        request = this.addToken(request, token);
      }
    }
    
    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 405) {
        return this.handle405Error(request, next);
      } else {
        return throwError(error);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private isTokenExpired(): boolean {
    const expiry = localStorage.getItem('expiresIn');
    return (expiry && (Date.now() > Number(expiry))) ? true : false;
  }

  private refreshToken(): void {
    this.isRefreshing = true;
    this.authService.refreshToken().subscribe(
      (response: any) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(response.access_token);
        localStorage.setItem('accessToken', response.access_token);
        localStorage.setItem('expiresIn', String(Date.now() + (response.expires_in * 1000)));
      },
      () => {
        this.router.navigate(['/login']);
      }
    );
  }

  private handle405Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(this.addToken(request, token.jwt));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }
}
