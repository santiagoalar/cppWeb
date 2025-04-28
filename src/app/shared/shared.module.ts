import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { SharedNavbarComponent } from './components/shared-navbar/shared-navbar.component';
import { SharedLayoutComponent } from './components/shared-layout/shared-layout.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    LanguageSwitcherComponent,
    SharedNavbarComponent,
    SharedLayoutComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDividerModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
  ],
  exports: [
    TranslateModule,
    LanguageSwitcherComponent,
    SharedNavbarComponent,
    SharedLayoutComponent
  ]
})
export class SharedModule { }