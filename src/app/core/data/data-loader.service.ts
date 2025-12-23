import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../shared/models/product.model';
import { User } from '../../shared/models/user.model';
import { MOCK_PRODUCTS, MOCK_USERS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class DataLoaderService {
  private readonly products$ = new BehaviorSubject<Product[]>(MOCK_PRODUCTS);
  private readonly users$ = new BehaviorSubject<User[]>(MOCK_USERS);

  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }
}
