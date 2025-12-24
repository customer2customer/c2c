import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { CustomerService } from '../../core/customer/customer.service';
import { CustomerProfile } from '../../shared/models/customer.model';
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
  passwordMismatch = false;
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly customerService: CustomerService
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      userType: ['buyer' as UserType, Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      locationNote: ['']
    });
  }

  async saveProfile(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = 'saving';
    this.passwordMismatch = false;
    this.errorMessage = '';
    try {
      const password = this.form.value.password ?? '';
      if (password !== this.form.value.confirmPassword) {
        this.status = 'error';
        this.passwordMismatch = true;
        return;
      }

      const current = await firstValueFrom(this.authService.getCurrentUser());
      const authUser =
        current?.email === this.form.value.email
          ? current
          : await this.authService.signUpWithPassword(
              this.form.value.email ?? '',
              password,
              `${this.form.value.firstName} ${this.form.value.lastName}`
            );
      const value = this.form.value;
      const profile: CustomerProfile = {
        id: authUser?.id ?? `guest-${Date.now()}`,
        email: value.email ?? authUser?.email ?? '',
        firstName: value.firstName ?? '',
        lastName: value.lastName ?? '',
        phone: value.phone ?? '',
        address: value.address ?? '',
        city: value.city ?? '',
        locationNote: value.locationNote ?? '',
        points: 0,
        createdAt: authUser?.createdAt ?? new Date(),
        updatedAt: new Date()
      };
      await this.customerService.upsert(profile);
      this.status = 'success';
      this.form.markAsPristine();
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Could not complete signup. Please try again.';
      this.status = 'error';
    }
  }
}
