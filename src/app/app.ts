import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './core/auth/services/auth.service';
import { User } from './shared/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  readonly title = 'C2C Marketplace';
  readonly currentUser$: Observable<User | null>;
  readonly currentYear = new Date().getFullYear();

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.currentUser$ = this.authService.getCurrentUser();
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }

  goToAccount(): void {
    this.router.navigate(['/account']);
  }

  logout(): void {
    this.authService.logout();
  }
}
