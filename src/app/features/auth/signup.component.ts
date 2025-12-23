import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { UserType } from '../../shared/models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./auth.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  status: 'idle' | 'saving' | 'success' | 'error' = 'idle';
  userTypes: UserType[] = ['buyer', 'seller', 'both'];
  form!: ReturnType<FormBuilder['group']>;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      userType: ['buyer' as UserType, Validators.required],
      address: [''],
      city: ['']
    });
  }

  async saveProfile(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = 'saving';
    try {
      const current = await firstValueFrom(this.authService.getCurrentUser());
      console.info('Profile saved placeholder', current, this.form.value);
      this.status = 'success';
    } catch (error) {
      console.error(error);
      this.status = 'error';
    }
  }
}
