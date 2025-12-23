import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { DataLoaderService } from '../../../core/data/data-loader.service';
import { Product, ProductCategory } from '../../../shared/models/product.model';

export type SortOption = 'priceLowHigh' | 'priceHighLow' | 'newest' | 'popular' | 'rating';

export interface ProductFilters {
  search: string;
  categories: ProductCategory[];
  priceRange?: { min?: number; max?: number };
  delivery?: 'courier' | 'directVisit' | 'both';
  city?: string;
  inStockOnly: boolean;
  sort?: SortOption;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly filters$ = new BehaviorSubject<ProductFilters>({
    search: '',
    categories: [],
    inStockOnly: false
  });

  constructor(private readonly dataLoader: DataLoaderService) {}

  getProducts(): Observable<Product[]> {
    return combineLatest([this.dataLoader.getProducts(), this.filters$]).pipe(
      map(([products, filters]) => this.applyFilters(products, filters))
    );
  }

  getProductById(productId: string): Observable<Product | undefined> {
    return this.dataLoader.getProducts().pipe(map((products) => products.find((p) => p.id === productId)));
  }

  updateFilters(newFilters: Partial<ProductFilters>): void {
    this.filters$.next({ ...this.filters$.value, ...newFilters });
  }

  private applyFilters(products: Product[], filters: ProductFilters): Product[] {
    const normalizedSearch = filters.search.toLowerCase().trim();

    let filtered = products.filter((product) => product.isActive);

    if (normalizedSearch) {
      filtered = filtered.filter((product) =>
        [product.productName, product.description, product.sellerName]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      );
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) => filters.categories.includes(product.category));
    }

    if (filters.priceRange?.min !== undefined) {
      filtered = filtered.filter((product) => product.c2cPrice >= (filters.priceRange?.min ?? 0));
    }

    if (filters.priceRange?.max !== undefined) {
      filtered = filtered.filter((product) => product.c2cPrice <= (filters.priceRange?.max ?? Number.MAX_SAFE_INTEGER));
    }

    if (filters.delivery) {
      filtered = filtered.filter((product) => {
        if (filters.delivery === 'both') {
          return product.deliveryOptions.courier && product.deliveryOptions.directVisit;
        }
        const deliveryKey = filters.delivery as keyof Product['deliveryOptions'];
        return product.deliveryOptions[deliveryKey];
      });
    }

    if (filters.city) {
      filtered = filtered.filter((product) => product.sellerLocation.city === filters.city);
    }

    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    if (filters.sort) {
      filtered = this.sortProducts(filtered, filters.sort);
    }

    return filtered;
  }

  private sortProducts(products: Product[], sort: SortOption): Product[] {
    const sorted = [...products];

    switch (sort) {
      case 'priceLowHigh':
        return sorted.sort((a, b) => a.c2cPrice - b.c2cPrice);
      case 'priceHighLow':
        return sorted.sort((a, b) => b.c2cPrice - a.c2cPrice);
      case 'rating':
        return sorted.sort((a, b) => b.sellerRating - a.sellerRating);
      case 'popular':
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'newest':
      default:
        return sorted.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
  }
}
