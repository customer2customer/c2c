import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductDetailComponent } from './product-detail.component';
import { ProductListComponent } from './product-list.component';
import { ProductRequestsComponent } from './product-requests.component';
import { AuthGuard } from '../../core/auth/services/auth.guard';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'requests', component: ProductRequestsComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ProductDetailComponent }
];

@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent, ProductRequestsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, RouterModule.forChild(routes)]
})
export class ProductsModule {}
