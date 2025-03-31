import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<string>('en');
  public language$ = this.languageSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang('en');
    
    const initialLang = browserLang && this.translate.getLangs().includes(browserLang) 
      ? browserLang 
      : 'en';
    
    this.translate.use(initialLang);
    this.languageSubject.next(initialLang);
    
    console.log('Language service initialized with language:', initialLang);
  }

  changeLanguage(lang: string): void {
    console.log('Changing language to:', lang);
    this.translate.use(lang);
    this.languageSubject.next(lang);
  }

  getCurrentLang(): string {
    return this.translate.currentLang || 'en';
  }
}