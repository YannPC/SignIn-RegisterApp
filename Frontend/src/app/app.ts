import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignIn } from './sign-in/sign-in';

@Component({
  selector: 'app-root',
  imports: [SignIn],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Sign In / Register App');
}
