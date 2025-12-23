import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { Observable, map } from 'rxjs';
import { CustomerProfile } from '../../shared/models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private readonly firestore: Firestore) {}

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
      createdAt: profile.createdAt ?? new Date(),
      updatedAt: new Date()
    };
    await setDoc(ref, payload, { merge: true });
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
      createdAt: toDate(customer.createdAt),
      updatedAt: toDate(customer.updatedAt)
    };
  }
}
