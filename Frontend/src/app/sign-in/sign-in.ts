import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { Component, Inject } from '@angular/core';
import { Auth } from '../auth';

@Component({
  selector: 'app-sign-in',
  imports: [
    NgIf,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  // sign-in form
  loginUsername = '';
  loginPassword = '';
  // register form
  registerUsername = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';

  message = '';

  private auth = Inject(Auth);

  signIn() {
    this.auth.login({ username: this.loginUsername, password: this.loginPassword }).subscribe({
      next: (res: { message: string }) => (this.message = res.message),
      error: (err: { error: { message: string } }) =>
        (this.message = err?.error?.message || 'Login failed'),
    });
  }

  register() {
    this.auth
      .register({
        username: this.registerUsername,
        email: this.registerEmail,
        password: this.registerPassword,
        confirmPassword: this.registerConfirmPassword,
      })
      .subscribe({
        next: (res: { message: string }) => (this.message = res.message),
        error: (err: { error: { message: string } }) =>
          (this.message = err?.error?.message || 'Registration failed'),
      });
  }
}
