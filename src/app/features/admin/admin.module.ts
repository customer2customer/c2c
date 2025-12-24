import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from '../../core/auth/services/admin.guard';
import { SharedModule } from '../../shared/shared.module';
import { AdminComponent } from './admin.component';
import { CustomerManagementComponent } from './customer-management.component';
import { ProductManagementComponent } from './product-management.component';
import { RequestManagementComponent } from './request-management.component';

const routes: Routes = [
  { path: '', component: AdminComponent, canActivate: [adminGuard] }
];

@NgModule({
  declarations: [AdminComponent, CustomerManagementComponent, ProductManagementComponent, RequestManagementComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, RouterModule.forChild(routes)]
})
export class AdminModule {}
