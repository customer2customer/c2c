import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/services/auth.guard';
import { adminGuard } from './core/auth/services/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module').then((m) => m.ProductsModule)
  },
  { path: 'about', loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule) },
  {
    path: 'account',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/account/account.module').then((m) => m.AccountModule)
  },
  {
    path: 'seller',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/seller/seller.module').then((m) => m.SellerModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.module').then((m) => m.AdminModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
