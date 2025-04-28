import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UserData } from 'src/app/models/user-data.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-shared-navbar',
  templateUrl: './shared-navbar.component.html',
  styleUrls: ['./shared-navbar.component.scss'],
    animations: [
      trigger('fadeIn', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
    ]
})
export class SharedNavbarComponent implements OnInit {
  currentLang: string;
  userData: UserData | null = null;

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router,
    private auth: AuthService
  ) {
    this.currentLang = this.translate.currentLang || 'en';
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.validateToken(token).subscribe({
        next: (response: UserData) => {
          this.userData = {
            id: response.id,
            name: response.name,
            email: response.email,
            phone: response.phone,
            role: response.role
          };
        },
        error: (err) => console.error('Token validation failed:', err)
      });
    }
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  signOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }

  isDirectivo(): boolean {
    return this.auth.isUserDirectivo();
  }
}
