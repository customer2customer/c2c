import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { CustomerService } from '../../../core/customer/customer.service';
import { DataLoaderService } from '../../../core/data/data-loader.service';
import { Product, ProductCategory, ProductRating } from '../../../shared/models/product.model';
import { User } from '../../../shared/models/user.model';

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
  private readonly adminEmail = 'tselvanmsc@gmail.com';
  private readonly productsSource$ = new BehaviorSubject<Product[]>([]);
  private readonly filters$ = new BehaviorSubject<ProductFilters>({
    search: '',
    categories: [],
    inStockOnly: false
  });

  constructor(
    private readonly dataLoader: DataLoaderService,
    private readonly customerService: CustomerService
  ) {
    combineLatest([this.dataLoader.getProducts(), this.customerService.getCustomers()]).subscribe(
      ([products, customers]) => {
        const eligibleCustomerIds = new Set(
          customers.filter((c) => (c.points ?? 0) > 1).map((customer) => customer.id)
        );

        const filtered = products.filter((product) => {
          if (!product.createdById) return true;
          return eligibleCustomerIds.has(product.createdById);
        });

        this.productsSource$.next(filtered);
      }
    );
  }

  getProducts(): Observable<Product[]> {
    return combineLatest([this.productsSource$, this.filters$]).pipe(
      map(([products, filters]) => this.applyFilters(products, filters))
    );
  }

  getRawProducts(): Observable<Product[]> {
    return this.productsSource$.asObservable();
  }

  getProductById(productId: string): Observable<Product | undefined> {
    return this.productsSource$.pipe(map((products) => products.find((p) => p.id === productId)));
  }

  updateFilters(newFilters: Partial<ProductFilters>): void {
    this.filters$.next({ ...this.filters$.value, ...newFilters });
  }

  async createProduct(product: Product): Promise<Product> {
    const payload = {
      ...product,
      id: product.id ?? `product-${Date.now()}`,
      createdAt: product.createdAt ?? new Date(),
      verificationStatus: product.verificationStatus ?? 'pending',
      updatedAt: new Date()
    };

    return this.dataLoader.addProduct(payload);
  }

  async updateProduct(updatedProduct: Product): Promise<void> {
    this.dataLoader.updateProduct({ ...updatedProduct, updatedAt: new Date() });
  }

  async deleteProduct(productId: string): Promise<void> {
    this.dataLoader.deleteProduct(productId);
  }

  getProductsForSeller(user: User): Observable<Product[]> {
    return this.getRawProducts().pipe(
      map((products) => {
        if (user.email === this.adminEmail) return products;
        return products.filter(
          (product) => product.createdByEmail === user.email || product.createdById === user.id
        );
      })
    );
  }

  async addOrUpdateRating(
    product: Product,
    user: User,
    rating: number,
    comment?: string
  ): Promise<void> {
    const ratings = product.ratings ?? [];
    const existingIndex = ratings.findIndex((entry) => entry.userId === user.id);
    const now = new Date();
    const entry: ProductRating = {
      userId: user.id,
      userName: user.name,
      comment: comment?.slice(0, 100),
      rating,
      createdAt: ratings[existingIndex]?.createdAt ?? now,
      updatedAt: now
    };

    if (existingIndex >= 0) {
      ratings[existingIndex] = { ...ratings[existingIndex], ...entry };
    } else {
      ratings.push(entry);
    }

    await this.updateProduct({ ...product, ratings });
  }

  averageRating(product?: Product): number {
    if (!product?.ratings?.length) return product?.sellerRating ?? 0;
    const sum = product.ratings.reduce((acc, entry) => acc + entry.rating, 0);
    return Number((sum / product.ratings.length).toFixed(1));
  }

  private applyFilters(products: Product[], filters: ProductFilters): Product[] {
    const normalizedSearch = filters.search.toLowerCase().trim();

    let filtered = products.filter((product) => product.isActive && product.verificationStatus === 'verified');

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
      filtered = filtered.filter((product) =>
        product.sellerLocations?.some((location) => location.city === filters.city)
      );
    }

    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => product.stock > 0 || product.isPreorderAvailable);
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
