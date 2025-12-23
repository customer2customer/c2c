import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./auth.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  status: 'idle' | 'sending' | 'sent' | 'error' = 'idle';
  passwordStatus: 'idle' | 'working' | 'success' | 'error' = 'idle';
  errorMessage = '';
  form!: ReturnType<FormBuilder['group']>;
  confirmationMessage = '';

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  async sendLink(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = 'sending';
    this.errorMessage = '';

    try {
      await this.authService.sendSignInLink(this.form.value.email ?? '');
      localStorage.setItem('c2c-login-email', this.form.value.email ?? '');
      this.confirmationMessage = 'You will receive an email with the login link. Tap it to finish signing in.';
      this.form.reset();
      this.status = 'sent';
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Unable to send magic link right now.';
      this.status = 'error';
    }
  }

  loginWithGoogle(): void {
    this.status = 'sending';
    this.authService
      .signInWithGoogle()
      .then(() => (this.status = 'sent'))
      .catch(() => {
        this.errorMessage = 'Google sign-in failed. Please try again.';
        this.status = 'error';
      });
  }

  async loginWithPassword(): Promise<void> {
    this.errorMessage = '';
    const password = this.form.value.password ?? '';
    if (this.form.controls['email'].invalid || !password) {
      this.form.controls['email'].markAsTouched();
      this.form.controls['password'].markAsTouched();
      this.errorMessage = 'Email and password are required.';
      this.passwordStatus = 'error';
      return;
    }

    if (password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      this.passwordStatus = 'error';
      return;
    }

    this.passwordStatus = 'working';
    try {
      await this.authService.signInWithPassword(this.form.value.email ?? '', this.form.value.password ?? '');
      this.passwordStatus = 'success';
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Email/password login failed.';
      this.passwordStatus = 'error';
    }
  }
}
