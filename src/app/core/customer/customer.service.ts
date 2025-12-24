import { Injectable } from '@angular/core';
import { Timestamp, collection, collectionData, deleteDoc, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, Auth as FirebaseAuth } from 'firebase/auth';
import { Observable, map } from 'rxjs';
import { CustomerProfile } from '../../shared/models/customer.model';
import { firebaseConfig } from '../firebase/firebase.config';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly secondaryAuth: FirebaseAuth;

  constructor(private readonly firestore: Firestore) {
    // Use a secondary Firebase app so admin-created accounts do not affect the current session
    const secondaryApp = initializeApp(firebaseConfig, 'admin-secondary');
    this.secondaryAuth = getAuth(secondaryApp);
  }

  getCustomers(): Observable<CustomerProfile[]> {
    const ref = collection(this.firestore, 'customers');
    return collectionData(ref, { idField: 'id' }).pipe(
      map((customers) => customers.map((customer) => this.normalize(customer)))
    );
  }

  getCustomerById(id: string): Observable<CustomerProfile | undefined> {
    const ref = doc(this.firestore, 'customers', id);
    return docData(ref, { idField: 'id' }).pipe(map((customer) => (customer ? this.normalize(customer) : undefined)));
  }

  async upsert(profile: CustomerProfile): Promise<void> {
    const ref = doc(this.firestore, 'customers', profile.id);
    const payload = {
      ...profile,
      points: profile.points ?? 0,
      createdAt: profile.createdAt ?? new Date(),
      updatedAt: new Date()
    };
    await setDoc(ref, payload, { merge: true });
  }

  async delete(id: string): Promise<void> {
    const ref = doc(this.firestore, 'customers', id);
    await deleteDoc(ref);
  }

  async createWithPassword(profile: Omit<CustomerProfile, 'id' | 'createdAt' | 'updatedAt'>, password: string): Promise<CustomerProfile> {
    const credential = await createUserWithEmailAndPassword(this.secondaryAuth, profile.email, password);
    const payload: CustomerProfile = {
      ...profile,
      id: credential.user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      points: profile.points ?? 0
    };
    await this.upsert(payload);
    return payload;
  }

  async updatePoints(ids: string[], points: number): Promise<void> {
    const updates = ids.map((id) => {
      const ref = doc(this.firestore, 'customers', id);
      return updateDoc(ref, { points, updatedAt: new Date() });
    });
    await Promise.all(updates);
  }

  isProfileComplete(profile?: CustomerProfile): boolean {
    if (!profile) return false;
    return Boolean(profile.firstName && profile.lastName && profile.email && profile.phone && profile.address && profile.city);
  }

  private normalize(customer: Partial<CustomerProfile>): CustomerProfile {
    const toDate = (value?: unknown): Date => {
      if ((value as Timestamp)?.toDate) return (value as Timestamp).toDate();
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
