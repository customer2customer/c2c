import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class AdminComponent {
  section: 'customers' | 'products' | 'requests' = 'customers';
}
