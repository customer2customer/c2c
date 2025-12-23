import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { ProductCategory } from '../../shared/models/product.model';
import { ProductService } from '../products/services/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./seller.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCreateComponent {
  status: 'idle' | 'saving' | 'success' | 'error' = 'idle';
  categories: ProductCategory[] = ['groceries', 'vegetables', 'clothing', 'services', 'dairy', 'homemade'];
  form!: ReturnType<FormBuilder['group']>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      category: ['vegetables' as ProductCategory, Validators.required],
      sku: ['', Validators.required],
      marketPrice: [0, [Validators.required, Validators.min(0)]],
      c2cPrice: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      courier: [true],
      directVisit: [true]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = 'saving';
    const value = this.form.value;
    const discount = (value.marketPrice ?? 0) - (value.c2cPrice ?? 0);

    this.authService.getCurrentUser().subscribe((user) => {
      const payload = {
        productName: value.productName ?? '',
        description: value.description ?? '',
        category: (value.category as ProductCategory) ?? 'vegetables',
        sku: value.sku ?? '',
        marketPrice: value.marketPrice ?? 0,
        c2cPrice: value.c2cPrice ?? 0,
        priceDiscount: discount,
        images: ['https://placehold.co/600x400'],
        stock: value.stock ?? 0,
        sellerId: user?.id ?? 'unknown',
        sellerName: user?.name ?? 'Current Seller',
        sellerRating: 4.5,
        reviewCount: 0,
        sellerLocation: { address: user?.location?.address ?? '', city: user?.location?.city ?? '' },
        deliveryOptions: { courier: Boolean(value.courier), directVisit: Boolean(value.directVisit) },
        availableDates: [],
        upcomingScheduled: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.info('Product saved placeholder', payload);
      this.status = 'success';
      this.router.navigate(['/seller']);
    });
  }
}
