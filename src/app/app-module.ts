import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
  provideFirebaseAppInstance,
  provideFirebaseAuthInstance,
  provideFirebaseFirestoreInstance
} from './core/firebase/firebase.service';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: FIREBASE_APP, useFactory: provideFirebaseAppInstance },
    { provide: FIREBASE_AUTH, useFactory: provideFirebaseAuthInstance, deps: [FIREBASE_APP] },
    { provide: FIREBASE_FIRESTORE, useFactory: provideFirebaseFirestoreInstance, deps: [FIREBASE_APP] }
  ],
  bootstrap: [App]
})
export class AppModule {}
