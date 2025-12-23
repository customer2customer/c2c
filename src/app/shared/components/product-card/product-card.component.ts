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
}
