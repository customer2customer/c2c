import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionCodeSettings,
  GoogleAuthProvider,
  User as FirebaseUser,
  UserCredential,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  DocumentReference,
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';
import { FirebaseService } from '../../firebase/firebase.service';
import { User } from '../../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser$: Observable<User | null>;
  private readonly currentUserSource = new BehaviorSubject<User | null>(null);
  private readonly adminEmails = ['tselvanmsc@gmail.com', 'admin@c2c.test'];

  constructor(private readonly router: Router, private readonly firebase: FirebaseService) {
    const auth = this.firebase.getAuth();
    setPersistence(auth, browserLocalPersistence);

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        this.currentUserSource.next(null);
        return;
      }
      const profile = await this.loadUserProfile(firebaseUser);
      this.currentUserSource.next(profile);
    });

    this.currentUser$ = this.currentUserSource.asObservable().pipe(shareReplay(1));
  }

  sendSignInLink(email: string): Promise<void> {
    const auth = this.firebase.getAuth();
    const actionCodeSettings: ActionCodeSettings = {
      url: `${window.location.origin}/login`,
      handleCodeInApp: true
    };

    return sendSignInLinkToEmail(auth, email, actionCodeSettings);
  }

  async completeSignIn(email: string, link: string): Promise<User> {
    const auth = this.firebase.getAuth();
    const credential = await signInWithEmailLink(auth, email, link);
    const profile = await this.syncUserProfile(credential);
    this.currentUserSource.next(profile);
    return profile;
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.firebase.getAuth(), provider);
    const profile = await this.syncUserProfile(credential);
    this.currentUserSource.next(profile);
    return profile;
  }

  async signUpWithPassword(email: string, password: string, displayName?: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(this.firebase.getAuth(), email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    const profile = await this.syncUserProfile(credential);
    this.currentUserSource.next(profile);
    return profile;
  }

  async signInWithPassword(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.firebase.getAuth(), email, password);
    const profile = await this.syncUserProfile(credential);
    this.currentUserSource.next(profile);
    return profile;
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.firebase.getAuth(), email);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => Boolean(user)));
  }

  isAdmin(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => Boolean(user?.isAdmin)));
  }

  async logout(): Promise<void> {
    await signOut(this.firebase.getAuth());
    this.currentUserSource.next(null);
    await this.router.navigate(['/products']);
  }

  private async syncUserProfile(credential: UserCredential): Promise<User> {
    const firebaseUser = credential.user;
    const firestoreUser = await this.loadUserProfile(firebaseUser);
    if (firestoreUser) {
      return firestoreUser;
    }

    const docRef = this.userDocRef(firebaseUser.uid);
    const profile: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'user',
      authProvider: credential.providerId?.includes('google.com') ? 'google' : 'password',
      userType: 'both',
      isAdmin: this.adminEmails.includes(firebaseUser.email ?? ''),
      trustScore: 0,
      totalOrders: 0,
      isActive: true
    };

    await setDoc(docRef, { ...profile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return profile;
  }

  private async loadUserProfile(firebaseUser: FirebaseUser): Promise<User | null> {
    const docRef = this.userDocRef(firebaseUser.uid);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
      id: firebaseUser.uid,
      email: data['email'] ?? firebaseUser.email ?? '',
      name: data['name'] ?? firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'user',
      authProvider: data['authProvider'] ?? 'password',
      userType: data['userType'] ?? 'both',
      isAdmin: data['isAdmin'] ?? this.adminEmails.includes(firebaseUser.email ?? ''),
      trustScore: data['trustScore'] ?? 0,
      totalOrders: data['totalOrders'] ?? 0,
      isActive: data['isActive'] ?? true
    };
  }

  private userDocRef(userId: string): DocumentReference {
    return doc(this.firebase.getFirestore(), 'users', userId);
  }
}
