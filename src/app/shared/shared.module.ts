import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from './components/product-card/product-card.component';

@NgModule({
  declarations: [ProductCardComponent],
  imports: [CommonModule, RouterModule],
  exports: [ProductCardComponent, CommonModule, RouterModule]
})
export class SharedModule {}
