import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, of, switchMap, map, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { DataLoaderService } from '../../core/data/data-loader.service';
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
  adminActionStatus$ = new BehaviorSubject<'idle' | 'working' | 'done' | 'error'>('idle');

  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private readonly dataLoader: DataLoaderService
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
    this.isAdmin$ = this.currentUser$.pipe(map((user) => user?.email === 'tselvanmsc@gmail.com'));
    this.products$ = this.currentUser$.pipe(
      switchMap((user) => (user ? this.productService.getProductsForSeller(user.id) : of([])))
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

  loadSampleProducts(): void {
    this.adminActionStatus$.next('working');
    this.dataLoader.loadSampleProducts().subscribe({
      next: () => this.adminActionStatus$.next('done'),
      error: () => this.adminActionStatus$.next('error')
    });
  }

  clearProducts(): void {
    this.adminActionStatus$.next('working');
    this.dataLoader.clearProducts().subscribe({
      next: () => this.adminActionStatus$.next('done'),
      error: () => this.adminActionStatus$.next('error')
    });
  }
}
