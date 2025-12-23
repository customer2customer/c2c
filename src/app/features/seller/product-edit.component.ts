import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductCategory } from '../../shared/models/product.model';
import { ProductService } from '../products/services/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./seller.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductEditComponent implements OnInit {
  categories: ProductCategory[] = ['groceries', 'vegetables', 'clothing', 'services', 'dairy', 'homemade'];
  form!: ReturnType<FormBuilder['group']>;
  private productId = '';
  private existingProduct?: Product;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService
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
      isPreorderAvailable: [false],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') ?? '';
    this.productService.getProductById(this.productId).subscribe((product) => {
      if (!product) return;
      this.existingProduct = product;
      this.form.patchValue({
        productName: product.productName,
        description: product.description,
        category: product.category,
        sku: product.sku,
        marketPrice: product.marketPrice,
        c2cPrice: product.c2cPrice,
        stock: product.stock,
        courier: product.deliveryOptions.courier,
        directVisit: product.deliveryOptions.directVisit,
        videoUrl: product.videoUrl,
        hoverMedia: product.hoverMedia,
        isPreorderAvailable: product.isPreorderAvailable,
        isActive: product.isActive
      });
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const discount = (value.marketPrice ?? 0) - (value.c2cPrice ?? 0);
    const availabilityStatus = (value.stock ?? 0) > 0 ? 'inStock' : 'preorder';
    if (!this.existingProduct) return;

    const updated: Product = {
      ...(this.existingProduct as Product),
      productName: value.productName ?? '',
      description: value.description ?? '',
      category: (value.category as ProductCategory) ?? 'vegetables',
      sku: value.sku ?? '',
      marketPrice: value.marketPrice ?? 0,
      c2cPrice: value.c2cPrice ?? 0,
      priceDiscount: discount,
      stock: value.stock ?? 0,
      deliveryOptions: { courier: Boolean(value.courier), directVisit: Boolean(value.directVisit) },
      availabilityStatus,
      isPreorderAvailable: Boolean(value.isPreorderAvailable),
      videoUrl: value.videoUrl ?? undefined,
      hoverMedia: value.hoverMedia ?? undefined,
      verificationStatus: 'verified',
      updatedAt: new Date()
    };

    this.productService.updateProduct(updated).catch((error) => console.error('Update failed', error));
  }
}
