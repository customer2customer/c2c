import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { Product } from '../../shared/models/product.model';
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
}
