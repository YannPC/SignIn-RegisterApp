import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http: HttpClient) {}

  register(payload: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.http.post<{ message: string }>('/api/register', payload);
  }

  login(payload: { username: string; password: string }) {
    return this.http.post<{ message: string }>('/api/login', payload);
  }
}
