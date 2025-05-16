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
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsModalComponent } from './orders/order-details-modal/order-details-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BulkUploadModalComponent } from './products/bulk-upload-modal/bulk-upload-modal.component';
import { RoutesComponent } from './routes/routes.component';
import { SellingPlansComponent } from './selling-plans/selling-plans.component';
import { RoutesDetailsModalComponent } from './routes/routes-details-modal/routes-details-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    ManufacturersComponent,
    ManufacturersModalComponent,
    ProductsComponent,
    ProductFormModalComponent,
    ProductDetailsModalComponent,
    OrdersComponent,
    OrderDetailsModalComponent,
    BulkUploadModalComponent,
    RoutesComponent,
    SellingPlansComponent,
    RoutesDetailsModalComponent
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
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    TranslateModule,
    ManufacturersComponent,
    ManufacturersModalComponent,
    ProductsComponent,
    ProductFormModalComponent,
    ProductDetailsModalComponent,
    OrdersComponent,
    OrderDetailsModalComponent,
    BulkUploadModalComponent,
    RoutesComponent,
    SellingPlansComponent,
  ]
})
export class SharedDeclarationsModule { }