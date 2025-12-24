import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Product, ProductRating, VerificationStatus } from '../../shared/models/product.model';
import { User } from '../../shared/models/user.model';
import { FirebaseService } from '../firebase/firebase.service';
import { MOCK_PRODUCTS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class DataLoaderService {
  private readonly products$ = new BehaviorSubject<Product[]>([]);
  private readonly users$ = new BehaviorSubject<User[]>([]);
  private readonly productCollection: CollectionReference<DocumentData>;
  private readonly userCollection: CollectionReference<DocumentData>;

  constructor(private readonly firebase: FirebaseService) {
    const firestore = this.firebase.getFirestore();
    this.productCollection = collection(firestore, 'products');
    this.userCollection = collection(firestore, 'users');

    onSnapshot(this.productCollection, (snapshot) => {
      const products = snapshot.docs.map((docSnap) => this.normalizeProduct({ id: docSnap.id, ...docSnap.data() }));
      this.products$.next(products);
    });

    onSnapshot(this.userCollection, (snapshot) => {
      const users = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as any) })) as User[];
      this.users$.next(users);
    });
  }

  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  loadSampleProducts(): Observable<void> {
    const writes = MOCK_PRODUCTS.map((product) => {
      const id = product.id ?? doc(this.productCollection).id;
      const payload = this.normalizeProduct({ ...product, id });
      return setDoc(doc(this.productCollection, id), {
        ...payload,
        createdAt: payload.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    return from(Promise.all(writes).then(() => void 0));
  }

  clearProducts(): Observable<void> {
    const deleteAll = async (): Promise<void> => {
      const existing = await getDocs(this.productCollection);
      await Promise.all(existing.docs.map((docSnap) => deleteDoc(docSnap.ref)));
    };
    return from(deleteAll());
  }

  async addProduct(product: Product): Promise<Product> {
    const payload = this.normalizeProduct({ ...product, id: product.id ?? doc(this.productCollection).id });
    await setDoc(doc(this.productCollection, payload.id), {
      ...payload,
      createdAt: payload.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return payload;
  }

  async updateProduct(product: Product): Promise<void> {
    const payload = this.normalizeProduct(product);
    await setDoc(doc(this.productCollection, payload.id), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
  }

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(this.productCollection, id));
  }

  getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }

  private normalizeProduct(product: Partial<Product>): Product {
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

    const normalizeLocations = (): Product['sellerLocations'] => {
      if ((product as Product).sellerLocations?.length) {
        return (product as Product).sellerLocations;
      }

      const legacyLocation = (product as { sellerLocation?: Product['sellerLocations'][number] }).sellerLocation;
      if (legacyLocation) {
        return [legacyLocation];
      }

      return [{ address: 'Community Market', city: 'Pune' }];
    };

    const normalizeRatings = (): ProductRating[] => {
      const ratings = (product as { ratings?: ProductRating[] }).ratings;
      if (!ratings) return [];
      return ratings.map((rating) => ({
        ...rating,
        createdAt: toDate(rating.createdAt) ?? new Date(),
        updatedAt: toDate(rating.updatedAt) ?? new Date()
      }));
    };

    return {
      id: product.id ?? doc(this.productCollection).id,
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
      sellerLocations: normalizeLocations(),
      deliveryOptions: product.deliveryOptions ?? { courier: true, directVisit: true },
      availableDates: product.availableDates ?? [],
      upcomingScheduled: product.upcomingScheduled ?? [],
      isActive: product.isActive ?? true,
      availabilityStatus: product.availabilityStatus ?? 'inStock',
      isPreorderAvailable: product.isPreorderAvailable ?? false,
      videoUrl: product.videoUrl ?? undefined,
      hoverMedia: product.hoverMedia ?? undefined,
      verificationStatus: (product.verificationStatus as VerificationStatus) ?? 'pending',
      createdById: product.createdById ?? product.sellerId ?? 'community-seller',
      createdByEmail: product.createdByEmail ?? 'unknown@c2c.local',
      createdByName: product.createdByName ?? product.sellerName ?? 'Community Seller',
      ratings: normalizeRatings(),
      createdAt: toDate(product.createdAt),
      updatedAt: toDate(product.updatedAt)
    };
  }
}
