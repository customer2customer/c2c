import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { OtpVerifyComponent } from './otp-verify.component';
import { SignupComponent } from './signup.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'verify', component: OtpVerifyComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [LoginComponent, OtpVerifyComponent, SignupComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class AuthModule {}
