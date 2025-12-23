import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  declarations: [ProductCardComponent, SafeUrlPipe],
  imports: [CommonModule, RouterModule],
  exports: [ProductCardComponent, CommonModule, RouterModule, SafeUrlPipe]
})
export class SharedModule {}
