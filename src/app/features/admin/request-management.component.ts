import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductRequestService } from '../products/services/product-request.service';
import { ProductRequest } from '../../shared/models/product-request.model';

@Component({
  selector: 'app-request-management',
  templateUrl: './request-management.component.html',
  styleUrls: ['./request-management.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class RequestManagementComponent {
  requests$;
  loading = false;
  error = false;

  constructor(private readonly requestService: ProductRequestService) {
    this.requests$ = this.requestService.getAll();
  }

  loadSamples(): void {
    this.loading = true;
    this.error = false;
    this.requestService.loadSamples().subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  clear(): void {
    this.loading = true;
    this.error = false;
    this.requestService.clear().subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  verify(request: ProductRequest, approved: boolean): void {
    this.loading = true;
    this.error = false;
    this.requestService
      .verify(request.id, approved, 'admin')
      .then(() => {
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.error = true;
      });
  }

  delete(request: ProductRequest): void {
    this.loading = true;
    this.error = false;
    this.requestService
      .delete(request.id)
      .then(() => {
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.error = true;
      });
  }
}
