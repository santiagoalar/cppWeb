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
  loading: boolean = false;

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
    this.loading = true;
    this.productsService.getAllProducts().subscribe({
      next: products => {
        this.products = products;
        this.imageIndices = {};
        this.products.forEach(p => this.imageIndices[p.id] = 0);
        this.loading = false;
      },
      error: err => {
        console.error('Error loading products', err);
        this.loading = false;
        this.showSnackBar('PRODUCTS.ERROR.LOADING');
      }
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
    this.loading = true;
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts(); // This will reset loading state after fetching
        this.showSnackBar('PRODUCTS.SUCCESS.DELETED');
      },
      error: err => {
        console.error('Error deleting product', err);
        this.loading = false;
        this.showSnackBar('PRODUCTS.ERROR.DELETE');
      }
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
      this.showSnackBar('PRODUCTS.ERROR.NOT_FOUND');
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

    this.loading = true;
    this.productsService.getProductById(this.searchId).subscribe({
      next: product => {
        this.loading = false;
        this.openDetailsModal(product);
      },
      error: err => {
        this.loading = false;
        this.showSnackBar('PRODUCTS.ERROR.NOT_FOUND');
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
        this.loadProducts();
      }
    });
  }

  isDirectivo(): boolean {
    return this.auth.isUserDirectivo();
  }

  private showSnackBar(messageKey: string): void {
    this.translate.get(messageKey).subscribe(message => {
      this.snackBar.open(message, this.translate.instant('COMMON.CLOSE'), {
        duration: 3000
      });
    });
  }
}