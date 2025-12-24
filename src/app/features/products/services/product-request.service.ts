import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Timestamp,
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { FirebaseService } from '../../../core/firebase/firebase.service';
import { ProductRequest } from '../../../shared/models/product-request.model';

@Injectable({ providedIn: 'root' })
export class ProductRequestService {
  private readonly requests$ = new BehaviorSubject<ProductRequest[]>([]);
  private readonly collectionRef: CollectionReference<DocumentData>;

  constructor(private readonly firebase: FirebaseService) {
    const firestore = this.firebase.getFirestore();
    this.collectionRef = collection(firestore, 'productRequests');

    onSnapshot(this.collectionRef, (snapshot) => {
      const requests = snapshot.docs.map((docSnap) => this.normalize({ id: docSnap.id, ...docSnap.data() }));
      this.requests$.next(requests);
    });
  }

  getAll(): Observable<ProductRequest[]> {
    return this.requests$.asObservable();
  }

  getForUser(userId: string): Observable<ProductRequest[]> {
    return this.getAll().pipe(map((rows) => rows.filter((row) => row.requesterId === userId)));
  }

  async create(request: Omit<ProductRequest, 'id' | 'createdAt' | 'updatedAt' | 'approved'>): Promise<ProductRequest> {
    const docRef = doc(this.collectionRef);
    const payload: ProductRequest = {
      ...request,
      id: docRef.id,
      approved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(docRef, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return payload;
  }

  async update(request: ProductRequest): Promise<void> {
    await setDoc(doc(this.collectionRef, request.id), { ...request, updatedAt: serverTimestamp() }, { merge: true });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.collectionRef, id));
  }

  async verify(id: string, approved: boolean, verifiedBy: string): Promise<void> {
    await updateDoc(doc(this.collectionRef, id), { approved, verifiedBy, updatedAt: serverTimestamp() });
  }

  loadSamples(): Observable<void> {
    const samples: ProductRequest[] = [
      {
        id: 'req-sample-1',
        title: 'Bulk organic vegetables for community kitchen',
        description: 'Weekly supply of seasonal vegetables, washed and ready for cooking.',
        category: 'groceries',
        requesterId: 'customer-c2c1',
        requesterName: 'C2C One',
        requesterEmail: 'c2c1@gmail.com',
        approved: true,
        verifiedBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'req-sample-2',
        title: 'On-demand laptop repair visit',
        description: 'Looking for a trusted technician who can visit home and fix screen issues.',
        category: 'services',
        requesterId: 'customer-c2c2',
        requesterName: 'C2C Two',
        requesterEmail: 'c2c2@gmail.com',
        approved: false,
        verifiedBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const writes = samples.map((sample) =>
      setDoc(doc(this.collectionRef, sample.id), { ...sample, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
    );
    return from(Promise.all(writes).then(() => void 0));
  }

  clear(): Observable<void> {
    const clearAll = async (): Promise<void> => {
      const snapshot = await getDocs(this.collectionRef);
      if (snapshot.empty) return;
      await Promise.all(snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref)));
    };
    return from(clearAll());
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
