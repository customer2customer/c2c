import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Product } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private readonly firestore: Firestore) {}

  fetchCollection<T>(collectionName: string): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return collectionData(collectionRef, { idField: 'id' }) as Observable<T[]>;
  }

  saveProduct(product: Product): Observable<Product> {
    const collectionRef = collection(this.firestore, 'products');
    return from(addDoc(collectionRef, product)).pipe(
      map((docRef) => ({ ...product, id: docRef.id }))
    );
  }
}
