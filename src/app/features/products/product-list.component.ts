import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product, ProductCategory } from '../../shared/models/product.model';
import { ProductService, SortOption } from './services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  search = '';
  selectedCategories: ProductCategory[] = [];
  selectedSort: SortOption = 'newest';
  private readonly destroy$ = new Subject<void>();

  categories: ProductCategory[] = ['groceries', 'vegetables', 'clothing', 'services', 'dairy', 'homemade'];
  sortOptions: Array<{ label: string; value: SortOption }> = [
    { label: 'Newest first', value: 'newest' },
    { label: 'Price: Low to High', value: 'priceLowHigh' },
    { label: 'Price: High to Low', value: 'priceHighLow' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Highest Rated', value: 'rating' }
  ];

  constructor(private readonly productService: ProductService, private readonly router: Router) {}

  ngOnInit(): void {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((products) => (this.products = products));
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    this.productService.updateFilters({
      search: this.search,
      categories: this.selectedCategories,
      sort: this.selectedSort
    });
  }

  toggleCategory(category: ProductCategory): void {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter((item) => item !== category);
    } else {
      this.selectedCategories = [...this.selectedCategories, category];
    }
    this.applyFilters();
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  openProduct(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }
}
