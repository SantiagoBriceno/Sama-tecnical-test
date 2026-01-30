import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUser, RegisterUser } from '../../user/models/user.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string = environment.apiUrl + '/auth';
  constructor(
    private readonly http: HttpClient
  ) {}

  login(loginUser: LoginUser): Observable<{ accessToken: string, username: string}> {
    return this.http.post<{ accessToken: string, username: string }>(`${this.apiUrl}/login`, loginUser);
  }

  register(newUser: RegisterUser): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, newUser);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
