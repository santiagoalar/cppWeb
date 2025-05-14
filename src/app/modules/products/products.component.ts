import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormModalComponent } from './product-form-modal/product-form-modal.component';
import { ProductsService } from 'src/app/modules/services/products.service';
import { ProductData } from 'src/app/models/product-data.model';
import { ProductDetailsModalComponent } from './product-details-modal/product-details-modal.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BulkUploadModalComponent } from './bulk-upload-modal/bulk-upload-modal.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductsComponent implements OnInit {
  products: ProductData[] = [];
  imageIndices: Record<string, number> = {};
  searchId: string = '';

  constructor(
    private dialog: MatDialog,
    private productsService: ProductsService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getAllProducts().subscribe({
      next: products => {
        this.products = products;
        this.imageIndices = {};
        this.products.forEach(p => this.imageIndices[p.id] = 0);
      },
      error: err => console.error('Error loading products', err)
    });
  }

  openCreateProductModal() {
    const dialogRef = this.dialog.open(ProductFormModalComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(created => {
      if (created) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(id: string) {
    this.productsService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: err => console.error('Error deleting product', err)
    });
  }

  prevImage(productId: string): void {
    const index = this.imageIndices[productId];
    const images = this.products.find(p => p.id === productId)?.images || [];
    this.imageIndices[productId] = (index - 1 + images.length) % images.length;
  }

  nextImage(productId: string): void {
    const index = this.imageIndices[productId];
    const images = this.products.find(p => p.id === productId)?.images || [];
    this.imageIndices[productId] = (index + 1) % images.length;
  }

  openUpdateProductModal(productId: string): void {
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      console.error(`Product with id ${productId} not found`);
      return;
    }
    const dialogRef = this.dialog.open(ProductFormModalComponent, {
      width: '600px',
      data: product
    });
    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.loadProducts();
      }
    });
  }

  searchById() {
    if (!this.searchId) {
      return;
    }

    this.productsService.getProductById(this.searchId).subscribe({
      next: product => {
        this.openDetailsModal(product);
      },
      error: err => {
        this.translate.get('ALERTS.PRODUCT_NOT_FOUND').subscribe(message => {
          this.snackBar.open(message, 'OK', { duration: 3000 });
        });
        console.error('Error fetching product', err);
      }
    });
  }

  openDetailsModal(product: ProductData) {
    this.dialog.open(ProductDetailsModalComponent, {
      width: '800px',
      data: product
    }).afterClosed().subscribe(result => {
      if (result?.action === 'delete') {
        this.deleteProduct(result.id);
      } else if (result?.action === 'update') {
        this.openUpdateProductModal(result.id);
      }
    });
  }

  openBulkUploadModal(): void {
  const dialogRef = this.dialog.open(BulkUploadModalComponent, {
    width: '550px',
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      // Refresh products list after successful upload
      this.loadProducts();
    }
  });
}

  isDirectivo(): boolean {
    return this.auth.isUserDirectivo();
  }
}