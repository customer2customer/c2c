import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  loading = false;
  error = false;
  success = false;
  verificationLoading: Record<string, boolean> = {};
  verificationError: Record<string, boolean> = {};

  constructor(
    private readonly productService: ProductService,
    private readonly dataLoader: DataLoaderService
  ) {
    this.products$ = this.productService.getRawProducts();
  }

  updateVerification(product: Product, status: Product['verificationStatus']): void {
    this.verificationLoading = { ...this.verificationLoading, [product.id]: true };
    this.verificationError = { ...this.verificationError, [product.id]: false };
    this.productService
      .updateProduct({ ...product, verificationStatus: status })
      .then(() => {
        this.verificationLoading = { ...this.verificationLoading, [product.id]: false };
      })
      .catch(() => {
        this.verificationLoading = { ...this.verificationLoading, [product.id]: false };
        this.verificationError = { ...this.verificationError, [product.id]: true };
      });
  }

  deleteProduct(product: Product): void {
    this.loading = true;
    this.error = false;
    this.success = false;
    this.productService
      .deleteProduct(product.id)
      .then(() => {
        this.success = true;
      })
      .catch(() => {
        this.error = true;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadSample(): void {
    this.loading = true;
    this.error = false;
    this.success = false;
    this.dataLoader.loadSampleProducts().subscribe({
      next: () => {
        this.success = true;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  clear(): void {
    this.loading = true;
    this.error = false;
    this.success = false;
    this.dataLoader.clearProducts().subscribe({
      next: () => {
        this.success = true;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
