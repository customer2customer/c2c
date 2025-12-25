import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, of, switchMap, map } from 'rxjs';
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

  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
    this.products$ = this.currentUser$.pipe(
      switchMap((user) => {
        return user ? this.productService.getProductsForSeller(user, false) : of([]);
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
}
