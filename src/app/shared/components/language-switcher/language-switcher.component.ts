import { Component } from '@angular/core';
import { LanguageService } from '../../services/language-service/language-service.component';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent {
  constructor(public languageService: LanguageService) {}

  changeLanguage(lang: string): void {
    console.log(`Language switcher: changing to ${lang}`);
    this.languageService.changeLanguage(lang);
  }
}