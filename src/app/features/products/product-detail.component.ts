import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { Product, ProductRating } from '../../shared/models/product.model';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  product$!: Observable<Product | undefined>;
  ratingOptions = [1, 2, 3, 4, 5];
  ratingValue = 5;
  ratingComment = '';

  constructor(
    private readonly route: ActivatedRoute,
    public readonly router: Router,
    private readonly productService: ProductService,
    private readonly authService: AuthService
  ) {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params) => this.productService.getProductById(params.get('id') ?? ''))
    );
  }

  buyNow(product?: Product): void {
    if (!product) return;

    this.authService.isAuthenticated().subscribe((isAuthed) => {
      if (isAuthed) {
        alert(`Buying ${product.productName} coming soon!`);
      } else {
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: `/products/${product.id}` } });
      }
    });
  }

  availabilityMessage(product: Product): string {
    if (product.availabilityStatus === 'inStock') {
      return `${product.stock} available`;
    }
    if (product.availabilityStatus === 'preorder') {
      return product.isPreorderAvailable ? 'Available for preorder now' : 'Preorder closed';
    }
    return 'Out of stock';
  }

  average(product?: Product): number {
    return this.productService.averageRating(product);
  }

  ratingAllowed(product: Product, rating: ProductRating | undefined, userId: string | undefined): boolean {
    if (!userId) return false;
    return rating?.userId === userId || Boolean(rating === undefined && userId);
  }

  setRating(value: number): void {
    this.ratingValue = Math.min(Math.max(1, value), 5);
  }

  async submitRating(product?: Product): Promise<void> {
    if (!product) return;
    const user = await firstValueFrom(this.authService.getCurrentUser());
    if (!user) {
      await this.router.navigate(['/auth/login'], { queryParams: { returnUrl: `/products/${product.id}` } });
      return;
    }

    await this.productService.addOrUpdateRating(product, user, this.ratingValue, this.ratingComment);
    this.ratingComment = '';
  }
}
