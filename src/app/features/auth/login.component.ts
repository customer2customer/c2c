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
  errorMessage = '';
  form!: ReturnType<FormBuilder['group']>;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
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
      this.status = 'sent';
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Unable to send magic link right now.';
      this.status = 'error';
    }
  }
}
