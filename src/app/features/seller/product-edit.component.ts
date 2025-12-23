import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductCategory } from '../../shared/models/product.model';
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
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.productService.getProductById(id).subscribe((product) => {
      if (!product) return;
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
        isActive: product.isActive
      });
    });
  }

  save(): void {
    console.info('Save edits placeholder', this.form.value);
  }
}
