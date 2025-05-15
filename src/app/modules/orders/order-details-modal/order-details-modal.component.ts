import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order, OrderItem, OrderHistory } from 'src/app/models/order-data.model';
import { ProductData } from 'src/app/models/product-data.model';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProductsService } from '../../services/products.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface EnhancedOrderItem extends OrderItem {
  product?: ProductData;
  imageUrl?: string;
  description?: string;
  brand?: string;
  manufacturerId?: string;
  details?: Map<string, string>;
  storageConditions?: string;
  deliveryTime?: number;
  stock?: number;
}

@Component({
  selector: 'app-order-details-modal',
  templateUrl: './order-details-modal.component.html',
  styleUrls: ['./order-details-modal.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class OrderDetailsModalComponent implements OnInit {
  displayedColumns: string[] = ['productName', 'quantity', 'unitPrice', 'totalPrice'];
  historyColumns: string[] = ['date', 'status', 'description'];
  itemsDataSource: MatTableDataSource<OrderItem>;
  historyDataSource: MatTableDataSource<OrderHistory>;
  enhancedItems: EnhancedOrderItem[] = [];
  loading = false;
  
  constructor(
    public dialogRef: MatDialogRef<OrderDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public order: Order,
    private productsService: ProductsService
  ) {
    this.itemsDataSource = new MatTableDataSource(order.orderItems || []);
    this.historyDataSource = new MatTableDataSource(order.orderHistory || []);
  }
  
  ngOnInit(): void {
    this.loadProductDetails();
  }
  
  loadProductDetails(): void {
    if (!this.order.orderItems || this.order.orderItems.length === 0) {
      return;
    }

    this.loading = true;
    
    const productRequests = this.order.orderItems.map(item => 
      this.productsService.getProductById(item.productId).pipe(
        catchError(error => {
          console.error(`Error fetching product ${item.productId}:`, error);
          return of(null);
        })
      )
    );
    
    forkJoin(productRequests).pipe(
      map(products => {
        return this.order.orderItems!.map((item, index) => {
          const product = products[index];
          const enhancedItem: EnhancedOrderItem = { ...item };
          
          if (product) {
            enhancedItem.product = product;
            enhancedItem.imageUrl = product.images && product.images.length > 0 ? product.images[0] : undefined;
            enhancedItem.description = product.description;
            enhancedItem.brand = product.brand;
            enhancedItem.manufacturerId = product.manufacturerId;
            enhancedItem.details = product.details;
            enhancedItem.storageConditions = product.storageConditions;
            enhancedItem.deliveryTime = product.deliveryTime;
            enhancedItem.stock = product.stock;
          }
          
          return enhancedItem;
        });
      })
    ).subscribe({
      next: (items) => {
        this.enhancedItems = items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product details:', error);
        this.enhancedItems = this.order.orderItems!;
        this.loading = false;
      }
    });
  }
  
  close(): void {
    this.dialogRef.close();
  }
  
  getTotalItems(): number {
    if (!this.order.orderItems || this.order.orderItems.length === 0) return 0;
    return this.order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}