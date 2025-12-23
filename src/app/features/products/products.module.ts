import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductDetailComponent } from './product-detail.component';
import { ProductListComponent } from './product-list.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: ':id', component: ProductDetailComponent }
];

@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent],
  imports: [CommonModule, FormsModule, SharedModule, RouterModule.forChild(routes)]
})
export class ProductsModule {}
