import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  status$ = new BehaviorSubject<'idle' | 'working' | 'error'>('idle');

  constructor(private readonly requestService: ProductRequestService) {
    this.requests$ = this.requestService.getAll();
  }

  verify(request: ProductRequest, approved: boolean): void {
    this.status$.next('working');
    this.requestService
      .verify(request.id, approved, 'admin')
      .then(() => this.status$.next('idle'))
      .catch(() => this.status$.next('error'));
  }

  delete(request: ProductRequest): void {
    this.status$.next('working');
    this.requestService
      .delete(request.id)
      .then(() => this.status$.next('idle'))
      .catch(() => this.status$.next('error'));
  }
}
