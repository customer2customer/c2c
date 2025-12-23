import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { firebaseConfig } from './core/firebase/firebase.config';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [App]
})
export class AppModule {}
