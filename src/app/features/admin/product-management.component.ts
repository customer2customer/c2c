import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataLoaderService } from '../../core/data/data-loader.service';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../products/services/product.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ProductManagementComponent {
  products$;
  actionStatus$ = new BehaviorSubject<'idle' | 'working' | 'done' | 'error'>('idle');
  verificationStatus$ = new BehaviorSubject<{ [id: string]: 'idle' | 'updating' | 'error' }>({});

  constructor(
    private readonly productService: ProductService,
    private readonly dataLoader: DataLoaderService
  ) {
    this.products$ = this.productService.getRawProducts();
  }

  updateVerification(product: Product, status: Product['verificationStatus']): void {
    this.verificationStatus$.next({ ...this.verificationStatus$.value, [product.id]: 'updating' });
    this.productService
      .updateProduct({ ...product, verificationStatus: status })
      .then(() => this.verificationStatus$.next({ ...this.verificationStatus$.value, [product.id]: 'idle' }))
      .catch(() => this.verificationStatus$.next({ ...this.verificationStatus$.value, [product.id]: 'error' }));
  }

  deleteProduct(product: Product): void {
    this.actionStatus$.next('working');
    this.productService
      .deleteProduct(product.id)
      .then(() => this.actionStatus$.next('done'))
      .catch(() => this.actionStatus$.next('error'));
  }

  loadSample(): void {
    this.actionStatus$.next('working');
    this.dataLoader.loadSampleProducts().subscribe({
      next: () => this.actionStatus$.next('done'),
      error: () => this.actionStatus$.next('error')
    });
  }

  clear(): void {
    this.actionStatus$.next('working');
    this.dataLoader.clearProducts().subscribe({
      next: () => this.actionStatus$.next('done'),
      error: () => this.actionStatus$.next('error')
    });
  }
}
