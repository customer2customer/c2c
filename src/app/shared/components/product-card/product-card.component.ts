import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input({ required: true })
  product!: Product;

  get discountPercent(): number {
    return Math.round(((this.product.marketPrice - this.product.c2cPrice) / this.product.marketPrice) * 100);
  }

  get stockLabel(): string {
    if (this.product.availabilityStatus === 'preorder') {
      return 'Preorder open';
    }
    if (this.product.stock === 0) {
      return 'Out of stock';
    }
    return `${this.product.stock} left`;
  }
}
