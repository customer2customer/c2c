import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { CustomerService } from '../../core/customer/customer.service';
import { CustomerProfile } from '../../shared/models/customer.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit, OnDestroy {
  form!: ReturnType<FormBuilder['group']>;
  status: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  resetStatus: 'idle' | 'sending' | 'sent' | 'error' = 'idle';
  private readonly destroy$ = new Subject<void>();
  private currentCustomerId = '';
  private existingCreatedAt?: Date;
  isPasswordUser = false;
  currentEmail = '';
  points = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly customerService: CustomerService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      locationNote: ['']
    });
  }

  ngOnInit(): void {
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (!user) return;
        this.currentEmail = user.email;
        this.isPasswordUser = user.authProvider === 'password';
        this.customerService
          .getCustomerById(user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((profile) => {
            const fallback: CustomerProfile = {
              id: user.id,
              email: user.email,
              firstName: user.name,
              lastName: '',
              phone: user.phone ?? '',
              address: user.location?.address ?? '',
              city: user.location?.city ?? '',
              locationNote: '',
              points: 0,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            const data = profile ?? fallback;
            this.currentCustomerId = data.id;
            this.existingCreatedAt = data.createdAt;
            this.points = data.points ?? 0;
            this.form.patchValue(data);
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = 'saving';
    const value = this.form.value;
    const profile: CustomerProfile = {
      id: this.currentCustomerId || value.email,
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
      phone: value.phone,
      address: value.address,
      city: value.city,
      locationNote: value.locationNote,
      points: this.points,
      createdAt: this.existingCreatedAt ?? new Date(),
      updatedAt: new Date()
    };
    try {
      await this.customerService.upsert(profile);
      this.status = 'saved';
    } catch (error) {
      console.error(error);
      this.status = 'error';
    }
  }

  resetPassword(): void {
    if (!this.isPasswordUser || !this.currentEmail) return;
    this.resetStatus = 'sending';
    this.authService
      .resetPassword(this.currentEmail)
      .then(() => (this.resetStatus = 'sent'))
      .catch(() => (this.resetStatus = 'error'));
  }
}
