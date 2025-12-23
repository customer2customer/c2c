import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionCodeSettings,
  Auth,
  authState,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
  User as FirebaseUser
} from '@angular/fire/auth';
import { Observable, map, shareReplay } from 'rxjs';
import { User } from '../../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser$: Observable<User | null>;

  constructor(private readonly router: Router, private readonly auth: Auth) {
    this.currentUser$ = authState(this.auth).pipe(
      map((firebaseUser) => this.mapFirebaseUser(firebaseUser)),
      shareReplay(1)
    );
  }

  sendSignInLink(email: string): Promise<void> {
    const actionCodeSettings: ActionCodeSettings = {
      url: `${window.location.origin}/auth/verify`,
      handleCodeInApp: true
    };

    return sendSignInLinkToEmail(this.auth, email, actionCodeSettings).then(() => {
      localStorage.setItem('authEmail', email);
    });
  }

  completeSignIn(email: string, link: string): Promise<User> {
    if (!isSignInWithEmailLink(this.auth, link)) {
      return Promise.reject(new Error('Invalid or expired sign-in link.'));
    }

    return signInWithEmailLink(this.auth, email, link).then((credential) => {
      localStorage.removeItem('authEmail');
      return this.mapFirebaseUser(credential.user)!;
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => Boolean(user)));
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => this.router.navigate(['/']).then(() => undefined));
  }

  private mapFirebaseUser(firebaseUser: FirebaseUser | null): User | null {
    if (!firebaseUser) {
      return null;
    }

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'New User',
      userType: 'both',
      trustScore: 0,
      totalOrders: 0,
      isActive: true
    };
  }
}
