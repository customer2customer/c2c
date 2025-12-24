import { Inject, Injectable, InjectionToken } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase.config';

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP');
export const FIREBASE_AUTH = new InjectionToken<Auth>('FIREBASE_AUTH');
export const FIREBASE_FIRESTORE = new InjectionToken<Firestore>('FIREBASE_FIRESTORE');

export function provideFirebaseAppInstance(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export function provideFirebaseAuthInstance(app: FirebaseApp): Auth {
  return getAuth(app);
}

export function provideFirebaseFirestoreInstance(app: FirebaseApp): Firestore {
  return getFirestore(app);
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(
    @Inject(FIREBASE_APP) private app: FirebaseApp,
    @Inject(FIREBASE_AUTH) private auth: Auth,
    @Inject(FIREBASE_FIRESTORE) private firestore: Firestore
  ) {}

  getFirestore(): Firestore {
    return this.firestore;
  }

  getAuth(): Auth {
    return this.auth;
  }
}
