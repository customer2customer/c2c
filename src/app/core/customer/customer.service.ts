import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CustomerProfile } from '../../shared/models/customer.model';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly customers$ = new BehaviorSubject<CustomerProfile[]>([]);
  private readonly collectionRef: CollectionReference<DocumentData>;

  constructor(private readonly firebase: FirebaseService) {
    const firestore = this.firebase.getFirestore();
    this.collectionRef = collection(firestore, 'customers');

    onSnapshot(
      this.collectionRef,
      (snapshot) => {
        const customers = snapshot.docs.map((docSnap) => this.normalize({ id: docSnap.id, ...docSnap.data() }));
        this.customers$.next(customers);
      },
      (error) => {
        console.error('Customers listener failed, clearing cache', error);
        this.customers$.next([]);
      }
    );
  }

  getCustomers(): Observable<CustomerProfile[]> {
    return this.customers$.asObservable();
  }

  getCustomerById(id: string): Observable<CustomerProfile | undefined> {
    return this.customers$.pipe(map((customers) => customers.find((customer) => customer.id === id)));
  }

  async upsert(profile: CustomerProfile): Promise<void> {
    const docRef = doc(this.collectionRef, profile.id);
    const payload = {
      ...profile,
      createdAt: profile.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(docRef, payload, { merge: true });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.collectionRef, id));
  }

  async createWithPassword(
    profile: Omit<CustomerProfile, 'id' | 'createdAt' | 'updatedAt'>,
    _password: string
  ): Promise<CustomerProfile> {
    const docRef = doc(this.collectionRef);
    const payload: CustomerProfile = {
      ...profile,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      points: profile.points ?? 0
    } as CustomerProfile;

    await setDoc(docRef, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return payload;
  }

  async updatePoints(ids: string[], points: number): Promise<void> {
    const updates = ids.map((id) => updateDoc(doc(this.collectionRef, id), { points, updatedAt: serverTimestamp() }));
    await Promise.all(updates);
  }

  isProfileComplete(profile?: CustomerProfile): boolean {
    if (!profile) return false;
    return Boolean(profile.firstName && profile.lastName && profile.email && profile.phone && profile.address && profile.city);
  }

  private normalize(customer: Partial<CustomerProfile>): CustomerProfile {
    const toDate = (value?: unknown): Date => {
      if ((value as { toDate?: () => Date })?.toDate) return (value as { toDate?: () => Date }).toDate!();
      return value ? new Date(value as string) : new Date();
    };

    return {
      id: customer.id ?? '',
      email: customer.email ?? '',
      firstName: customer.firstName ?? '',
      lastName: customer.lastName ?? '',
      phone: customer.phone ?? '',
      address: customer.address ?? '',
      city: customer.city ?? '',
      locationNote: customer.locationNote ?? '',
      points: customer.points ?? 0,
      createdAt: toDate(customer.createdAt),
      updatedAt: toDate(customer.updatedAt)
    };
  }
}
