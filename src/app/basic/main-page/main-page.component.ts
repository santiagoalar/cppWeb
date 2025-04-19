import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  userRole: string = localStorage.getItem('userRole') || 'User';
  userName: string = localStorage.getItem('userName') || 'Guest';
  currentLang: string;

  constructor(private router: Router, private translate: TranslateService) { 
    this.currentLang = this.translate.currentLang || 'en';
  }

  ngOnInit(): void {
    // Optionally refresh the role and username if needed.
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.userRole = storedRole;
    }
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userName = storedName;
    }
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  signOut(): void {
    localStorage.clear();
    this.router.navigate(['/sign-in']);
  }
}
