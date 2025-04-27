import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from '../app-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ManufacturersModalComponent } from './manufacturers/manufacturers-modal/manufacturers-modal.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ProductsComponent } from './products/products.component';
import { ProductFormModalComponent } from './products/product-form-modal/product-form-modal.component';
import {  MatCardModule } from '@angular/material/card';
import { ProductDetailsModalComponent } from './products/product-details-modal/product-details-modal.component';

@NgModule({
  declarations: [
    ManufacturersComponent,
    ManufacturersModalComponent,
    ProductsComponent,
    ProductFormModalComponent,
    ProductDetailsModalComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule
  ],
  exports: [
    TranslateModule,
    ManufacturersComponent,
    ManufacturersModalComponent,
    ProductsComponent,
    ProductFormModalComponent,
    ProductDetailsModalComponent,
  ]
})
export class SharedDeclarationsModule { }