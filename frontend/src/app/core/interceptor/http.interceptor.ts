import {
  HttpInterceptor as NgHttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class HttpInterceptor implements NgHttpInterceptor {
  constructor(
    private readonly authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const excludedUrls = ['/login', '/register'];
    const isExcluded = excludedUrls.some(url => req.url.includes(url));

    if (isExcluded) {
      return next.handle(req);
    }

    const token = this.authService.getToken();

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }


    return next.handle(authReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('HTTP Response:', event);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('accessToken');
          console.warn('Unauthorized request - redirecting to login.');
          // window.location.href = '/login';
        }
        return throwError(() => error);
      })
    );

  }
}
