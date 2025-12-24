import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, of, switchMap, map, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../products/services/product.service';

type SellerStats = {
  totalProducts: number;
  totalSales: number;
  averageRating: number;
};

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellerDashboardComponent {
  currentUser$!: ReturnType<AuthService['getCurrentUser']>;
  products$!: ReturnType<ProductService['getProducts']>;
  stats$!: Observable<SellerStats>;
  isAdmin$!: Observable<boolean>;
  verificationStatus$ = new BehaviorSubject<{ [id: string]: 'idle' | 'updating' | 'error' }>({});

  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
    this.isAdmin$ = this.currentUser$.pipe(map((user) => user?.email === 'tselvanmsc@gmail.com'));
    this.products$ = this.currentUser$.pipe(
      switchMap((user) => {
        return user ? this.productService.getProductsForSeller(user) : of([]);
      })
    );
    this.stats$ = this.products$.pipe(
      map((products) => {
        const active = products.filter((product) => product.isActive);
        return {
          totalProducts: active.length,
          averageRating:
            active.reduce((acc, product) => acc + product.sellerRating, 0) / (active.length || 1),
          totalSales: active.length * 5
        };
      })
    );
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).catch((error) => console.error('Delete failed', error));
  }

  onVerificationChange(product: Product, event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    const status = select?.value === 'verified' ? 'verified' : 'pending';
    this.updateVerification(product, status);
  }

  updateVerification(product: Product, status: Product['verificationStatus'] | string): void {
    const current = { ...this.verificationStatus$.value, [product.id]: 'updating' as const };
    this.verificationStatus$.next(current);

    const normalizedStatus: Product['verificationStatus'] = status === 'verified' ? 'verified' : 'pending';

    this.productService
      .updateProduct({ ...product, verificationStatus: normalizedStatus })
      .catch((error) => {
        console.error('Failed to update verification', error);
        this.verificationStatus$.next({ ...this.verificationStatus$.value, [product.id]: 'error' });
      })
      .then(() => {
        this.verificationStatus$.next({ ...this.verificationStatus$.value, [product.id]: 'idle' });
      });
  }
}
