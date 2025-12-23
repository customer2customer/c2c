import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/services/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule) },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module').then((m) => m.ProductsModule)
  },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule) },
  {
    path: 'seller',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/seller/seller.module').then((m) => m.SellerModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
