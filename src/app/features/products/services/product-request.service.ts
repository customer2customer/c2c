import { Injectable } from '@angular/core';
import {
  Firestore,
  Timestamp,
  collection,
  collectionData,
  deleteDoc,
  doc,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { ProductRequest } from '../../../shared/models/product-request.model';

@Injectable({ providedIn: 'root' })
export class ProductRequestService {
  constructor(private readonly firestore: Firestore) {}

  getAll(): Observable<ProductRequest[]> {
    const ref = collection(this.firestore, 'productRequests');
    return collectionData(ref, { idField: 'id' }).pipe(map((rows) => rows.map((row) => this.normalize(row))));
  }

  getForUser(userId: string): Observable<ProductRequest[]> {
    return this.getAll().pipe(map((rows) => rows.filter((row) => row.requesterId === userId)));
  }

  async create(request: Omit<ProductRequest, 'id' | 'createdAt' | 'updatedAt' | 'approved'>): Promise<ProductRequest> {
    const ref = doc(collection(this.firestore, 'productRequests'));
    const payload: ProductRequest = {
      ...request,
      id: ref.id,
      approved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(ref, payload);
    return payload;
  }

  async update(request: ProductRequest): Promise<void> {
    const ref = doc(this.firestore, 'productRequests', request.id);
    await updateDoc(ref, { ...request, updatedAt: new Date() });
  }

  async delete(id: string): Promise<void> {
    const ref = doc(this.firestore, 'productRequests', id);
    await deleteDoc(ref);
  }

  async verify(id: string, approved: boolean, verifiedBy: string): Promise<void> {
    const ref = doc(this.firestore, 'productRequests', id);
    await updateDoc(ref, { approved, verifiedBy, updatedAt: new Date() });
  }

  private normalize(raw: any): ProductRequest {
    const toDate = (value: unknown): Date => {
      if ((value as Timestamp)?.toDate) return (value as Timestamp).toDate();
      return value ? new Date(value as string) : new Date();
    };
    return {
      id: raw.id,
      title: raw.title ?? 'Request',
      description: raw.description ?? '',
      category: raw.category ?? 'general',
      requesterId: raw.requesterId ?? '',
      requesterName: raw.requesterName ?? '',
      requesterEmail: raw.requesterEmail ?? '',
      approved: Boolean(raw.approved),
      verifiedBy: raw.verifiedBy,
      createdAt: toDate(raw.createdAt),
      updatedAt: toDate(raw.updatedAt)
    };
  }
}
