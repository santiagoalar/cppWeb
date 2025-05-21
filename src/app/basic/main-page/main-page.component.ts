import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Inject } from '@angular/core';
import { VersionService } from 'src/app/modules/services/version.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  appVersion: string;
  
  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private versionService: VersionService
  ) {
    this.appVersion = this.versionService.getVersion();
  }

  ngOnInit(): void {
    console.log(`App version: ${this.appVersion}`);
  }
}