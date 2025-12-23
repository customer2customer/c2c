import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, DocumentData } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { Product } from '../../shared/models/product.model';
import { User } from '../../shared/models/user.model';
import { MOCK_PRODUCTS, MOCK_USERS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class DataLoaderService {
  private readonly fallbackProducts$ = new BehaviorSubject<Product[]>(MOCK_PRODUCTS);
  private readonly users$ = new BehaviorSubject<User[]>(MOCK_USERS);

  private readonly generateId = (): string => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `product-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  constructor(private readonly firestore: Firestore) {}

  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');

    return collectionData(productsRef, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => this.normalizeProduct(doc as Partial<Product> & DocumentData))
      ),
      tap((products) => {
        if (products.length) {
          this.fallbackProducts$.next(products);
        }
      }),
      catchError((error) => {
        console.error('Falling back to local mock products because Firestore failed:', error);
        return this.fallbackProducts$;
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }

  private normalizeProduct(product: Partial<Product> & DocumentData): Product {
    const toDate = (value: unknown): Date | undefined => {
      if ((value as Timestamp)?.toDate) {
        return (value as Timestamp).toDate();
      }
      return value ? new Date(value as string) : undefined;
    };

    const safeImages = (product.images && product.images.length
      ? product.images
      : [
          'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
        ]) as string[];

    return {
      id: product.id ?? this.generateId(),
      productName: product.productName ?? 'Community product',
      description:
        product.description ??
        'Locally sourced product from trusted neighbors with transparent quality checks.',
      category: (product.category as Product['category']) ?? 'groceries',
      sku: product.sku ?? 'sku-unknown',
      marketPrice: product.marketPrice ?? 0,
      c2cPrice: product.c2cPrice ?? 0,
      priceDiscount: product.priceDiscount ?? Math.max((product.marketPrice ?? 0) - (product.c2cPrice ?? 0), 0),
      images: safeImages,
      stock: product.stock ?? 0,
      sellerId: product.sellerId ?? 'community-seller',
      sellerName: product.sellerName ?? 'Community Seller',
      sellerRating: product.sellerRating ?? 4.8,
      reviewCount: product.reviewCount ?? 12,
      sellerLocation: product.sellerLocation ?? { address: 'Community Market', city: 'Pune' },
      deliveryOptions: product.deliveryOptions ?? { courier: true, directVisit: true },
      availableDates: product.availableDates ?? [],
      upcomingScheduled: product.upcomingScheduled ?? [],
      isActive: product.isActive ?? true,
      createdAt: toDate(product.createdAt),
      updatedAt: toDate(product.updatedAt)
    };
  }
}
