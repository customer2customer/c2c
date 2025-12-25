import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, firstValueFrom, map } from 'rxjs';
import { CustomerService } from '../../core/customer/customer.service';
import { CustomerProfile } from '../../shared/models/customer.model';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CustomerManagementComponent {
  customers$;
  selection$ = new BehaviorSubject<Set<string>>(new Set());

  loading = false;
  error = false;
  saved = false;

  customerForm;

  pointsForm;

  customersWithSelection$;

  constructor(private readonly fb: FormBuilder, private readonly customerService: CustomerService) {
    this.customers$ = this.customerService.getCustomers();
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      points: [0, [Validators.min(0)]]
    });

    this.pointsForm = this.fb.group({
      points: [1, [Validators.required, Validators.min(0)]],
      mode: ['selected', Validators.required]
    });

    this.customersWithSelection$ = combineLatest([this.customers$, this.selection$]).pipe(
      map(([customers, selection]) =>
        customers.map((customer) => ({ ...customer, selected: selection.has(customer.id) }))
      )
    );
  }

  toggleSelection(customerId: string, checked: boolean): void {
    const next = new Set(this.selection$.value);
    if (checked) {
      next.add(customerId);
    } else {
      next.delete(customerId);
    }
    this.selection$.next(next);
  }

  async createCustomer(): Promise<void> {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = false;
    this.saved = false;

    const payload = this.customerForm.value;
    try {
      const profile: Omit<CustomerProfile, 'id' | 'createdAt' | 'updatedAt'> = {
        firstName: payload.firstName ?? '',
        lastName: payload.lastName ?? '',
        email: payload.email ?? '',
        phone: payload.phone ?? '',
        address: payload.address ?? '',
        city: payload.city ?? '',
        locationNote: '',
        createdByEmail: 'admin',
        createdById: 'admin',
        points: Number(payload.points ?? 0)
      };

      await this.customerService.createWithPassword(profile, payload.password ?? '');
      this.customerForm.reset({ points: 0 });
      this.saved = true;
    } catch (error) {
      console.error('Create failed', error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  async deleteCustomer(customer: CustomerProfile): Promise<void> {
    this.loading = true;
    this.error = false;
    this.saved = false;
    try {
      await this.customerService.delete(customer.id);
      this.saved = true;
    } catch (error) {
      console.error('Delete failed', error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  async updatePoints(): Promise<void> {
    if (this.pointsForm.invalid) {
      this.pointsForm.markAllAsTouched();
      return;
    }

    const { points, mode } = this.pointsForm.value;
    const customers = mode === 'all' ? await firstValueFrom(this.customers$) : undefined;
    const ids = mode === 'all'
      ? (customers ?? []).map((c) => c.id)
      : Array.from(this.selection$.value);

    if (!ids.length) return;

    this.loading = true;
    this.error = false;
    this.saved = false;
    try {
      await this.customerService.updatePoints(ids, Number(points ?? 0));
      this.saved = true;
    } catch (error) {
      console.error('Failed to update points', error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
}
