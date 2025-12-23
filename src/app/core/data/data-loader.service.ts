import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, DocumentData, getDocs, setDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { BehaviorSubject, Observable, catchError, from, map, of, switchMap, tap } from 'rxjs';
import { Product, VerificationStatus } from '../../shared/models/product.model';
import { User } from '../../shared/models/user.model';
import { MOCK_PRODUCTS, MOCK_USERS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class DataLoaderService {
  private readonly fallbackProducts$ = new BehaviorSubject<Product[]>([]);
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
      tap((products: Product[]) => {
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

  loadSampleProducts(): Observable<void> {
    const productsRef = collection(this.firestore, 'products');
    const tasks = MOCK_PRODUCTS.map((product) => {
      const ref = doc(productsRef, product.id);
      return setDoc(ref, { ...product, createdAt: product.createdAt ?? new Date(), updatedAt: new Date() });
    });
    return from(Promise.all(tasks)).pipe(map(() => void 0));
  }

  clearProducts(): Observable<void> {
    const productsRef = collection(this.firestore, 'products');
    return from(getDocs(productsRef)).pipe(
      switchMap((snapshot) => from(Promise.all(snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref))))),
      map(() => void 0),
      catchError((error) => {
        console.error('Failed to clear products', error);
        return of(void 0);
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
      sellerContact: product.sellerContact ?? { phone: '+91-9876543210', email: 'seller@example.com' },
      sellerLocation: product.sellerLocation ?? { address: 'Community Market', city: 'Pune' },
      deliveryOptions: product.deliveryOptions ?? { courier: true, directVisit: true },
      availableDates: product.availableDates ?? [],
      upcomingScheduled: product.upcomingScheduled ?? [],
      isActive: product.isActive ?? true,
      availabilityStatus: product.availabilityStatus ?? 'inStock',
      isPreorderAvailable: product.isPreorderAvailable ?? false,
      videoUrl: product.videoUrl ?? undefined,
      hoverMedia: product.hoverMedia ?? undefined,
      verificationStatus: (product.verificationStatus as VerificationStatus) ?? 'verified',
      createdById: product.createdById ?? product.sellerId ?? 'community-seller',
      createdByEmail: product.createdByEmail ?? 'unknown@c2c.local',
      createdByName: product.createdByName ?? product.sellerName ?? 'Community Seller',
      createdAt: toDate(product.createdAt),
      updatedAt: toDate(product.updatedAt)
    };
  }
}
