import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: false
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(url?: string | null): SafeResourceUrl | undefined {
    if (!url) return undefined;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
