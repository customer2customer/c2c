import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { CustomerService } from '../../core/customer/customer.service';
import { firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./auth.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtpVerifyComponent implements OnInit {
  status: 'idle' | 'verifying' | 'success' | 'error' = 'idle';
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly customerService: CustomerService
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('c2c-login-email') ?? '';
    const link = window.location.href;
    this.verify(email, link);
  }

  async verify(email: string, link: string): Promise<void> {
    if (!email) {
      this.errorMessage = 'Missing email. Please start the login flow again.';
      this.status = 'error';
      return;
    }

    this.status = 'verifying';
    try {
      const user = await this.authService.completeSignIn(email, link);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/products';
      localStorage.removeItem('c2c-login-email');
      this.status = 'success';
      const profile = await firstValueFrom(this.customerService.getCustomerById(user.id).pipe(take(1)));
      const profileComplete = this.customerService.isProfileComplete(profile);

      if (!profileComplete) {
        await this.router.navigate(['/account'], { queryParams: { returnUrl } });
      } else {
        await this.router.navigateByUrl(returnUrl);
      }
    } catch (error) {
      console.error(error);
      this.status = 'error';
      this.errorMessage = 'The verification link is invalid or expired.';
    }
  }
}
