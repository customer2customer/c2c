import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { catchError, finalize, firstValueFrom, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { ProductRequestService } from './services/product-request.service';
import { ProductRequest } from '../../shared/models/product-request.model';

@Component({
  selector: 'app-product-requests',
  templateUrl: './product-requests.component.html',
  styleUrls: ['./product-requests.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ProductRequestsComponent {
  currentUser$;
  approved$;
  myRequests$;

  editingRequest?: ProductRequest;

  form;

  categories = [
    { value: 'groceries', label: 'Groceries' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'services', label: 'Services' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'homemade', label: 'Homemade' }
  ];

  loading = false;
  hasError = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly requestService: ProductRequestService
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
    this.approved$ = this.requestService.getAll().pipe(map((rows) => rows.filter((row) => row.approved)));
    this.myRequests$ = this.currentUser$.pipe(
      switchMap((user) => (user ? this.requestService.getForUser(user.id) : of([])))
    );

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      category: ['general', Validators.required]
    });
  }

  async submit(): Promise<void> {
    const user = await firstValueFrom(this.currentUser$);
    if (!user) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.hasError = false;
    try {
      if (this.editingRequest) {
        await this.requestService.update({
          ...this.editingRequest,
          title: this.form.value.title ?? '',
          description: this.form.value.description ?? '',
          category: this.form.value.category ?? 'general',
          approved: false
        });
      } else {
        await this.requestService.create({
          title: this.form.value.title ?? '',
          description: this.form.value.description ?? '',
          category: this.form.value.category ?? 'general',
          requesterId: user.id,
          requesterName: user.name,
          requesterEmail: user.email
        });
      }
      this.form.reset({ category: 'general' });
      this.editingRequest = undefined;
    } catch (error) {
      console.error(error);
      this.hasError = true;
    } finally {
      this.loading = false;
    }
  }

  loadSamples(): void {
    this.loading = true;
    this.hasError = false;
    this.requestService
      .loadSamples()
      .pipe(
        catchError((error) => {
          console.error(error);
          this.hasError = true;
          return of(void 0);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  clearAll(): void {
    this.loading = true;
    this.hasError = false;
    this.requestService
      .clear()
      .pipe(
        catchError((error) => {
          console.error(error);
          this.hasError = true;
          return of(void 0);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  startEdit(request: ProductRequest): void {
    this.editingRequest = request;
    this.form.patchValue({
      title: request.title,
      description: request.description,
      category: request.category
    });
  }

  cancelEdit(): void {
    this.editingRequest = undefined;
    this.form.reset({ category: 'general' });
  }

  async markForReview(request: ProductRequest): Promise<void> {
    const user = await firstValueFrom(this.currentUser$);
    if (!user || user.id !== request.requesterId) return;
    this.loading = true;
    this.hasError = false;
    try {
      await this.requestService.update({ ...request, approved: false });
    } catch (error) {
      console.error(error);
      this.hasError = true;
    } finally {
      this.loading = false;
    }
  }
}
