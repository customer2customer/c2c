import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Product, ProductCategory } from '../../shared/models/product.model';
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
      directVisit: [true],
      videoUrl: [''],
      hoverMedia: [''],
      isPreorderAvailable: [false]
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
    const availabilityStatus = (value.stock ?? 0) > 0 ? 'inStock' : 'preorder';

    firstValueFrom(this.authService.getCurrentUser()).then((user) => {
      const payload: Product = {
        id: '',
        productName: value.productName ?? '',
        description: value.description ?? '',
        category: (value.category as ProductCategory) ?? 'vegetables',
        sku: value.sku ?? '',
        marketPrice: value.marketPrice ?? 0,
        c2cPrice: value.c2cPrice ?? 0,
        priceDiscount: discount,
        images: [
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
        ],
        stock: value.stock ?? 0,
        sellerId: user?.id ?? 'unknown',
        sellerName: user?.name ?? 'Current Seller',
        sellerRating: 4.5,
        reviewCount: 0,
        sellerContact: { phone: user?.phone ?? '+91-99999-11111', email: user?.email ?? '' },
        sellerLocations: [
          {
            address: user?.location?.address ?? 'Community marketplace',
            city: user?.location?.city ?? 'Local city'
          }
        ],
        deliveryOptions: { courier: Boolean(value.courier), directVisit: Boolean(value.directVisit) },
        availableDates: [],
        upcomingScheduled: [],
        isActive: true,
        availabilityStatus,
        isPreorderAvailable: Boolean(value.isPreorderAvailable),
        videoUrl: value.videoUrl ?? undefined,
        hoverMedia: value.hoverMedia ?? undefined,
        verificationStatus: 'pending',
        createdById: user?.id ?? 'unknown',
        createdByEmail: user?.email ?? 'unknown@c2c.local',
        createdByName: user?.name ?? 'Current Seller',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.productService
        .createProduct(payload)
        .then(() => {
          this.status = 'success';
          this.router.navigate(['/seller']);
        })
        .catch(() => (this.status = 'error'));
    });
  }
}
