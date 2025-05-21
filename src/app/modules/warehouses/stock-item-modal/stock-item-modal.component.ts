import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseStockItemsService } from '../../services/warehouses-stock-items.service';
import { ProductsService } from '../../services/products.service';
import { ProductData } from 'src/app/models/product-data.model';
import { WarehouseStockItemData } from '../../../models/warehouse-stock-items-data.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-stock-item-modal',
  templateUrl: './stock-item-modal.component.html',
  styleUrls: ['./stock-item-modal.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class StockItemModalComponent implements OnInit {
  stockItemForm: FormGroup;
  isNew: boolean;
  loading: boolean = false;
  productsLoading: boolean = false;
  products: ProductData[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StockItemModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      isNew: boolean, 
      stockItem?: WarehouseStockItemData,
      warehouseId: string 
    },
    private stockItemsService: WarehouseStockItemsService,
    private productsService: ProductsService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.isNew = data.isNew;
    this.stockItemForm = this.fb.group({
      warehouse_id: [data.warehouseId, Validators.required],
      item_id: ['', Validators.required],
      bar_code: [''],
      identification_code: [''],
      width: [0, [Validators.required, Validators.min(0)]],
      height: [0, [Validators.required, Validators.min(0)]],
      depth: [0, [Validators.required, Validators.min(0)]],
      weight: [0, [Validators.required, Validators.min(0)]],
      hallway: ['', Validators.required],
      shelf: ['', Validators.required],
      sold: [false],
      status: ['active']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    
    if (!this.isNew && this.data.stockItem) {
      this.stockItemForm.patchValue({
        warehouse_id: this.data.stockItem.warehouse_id,
        item_id: this.data.stockItem.item_id,
        bar_code: this.data.stockItem.bar_code,
        identification_code: this.data.stockItem.identification_code,
        width: this.data.stockItem.width,
        height: this.data.stockItem.height,
        depth: this.data.stockItem.depth,
        weight: this.data.stockItem.weight,
        hallway: this.data.stockItem.hallway,
        shelf: this.data.stockItem.shelf,
        sold: this.data.stockItem.sold || false,
        status: this.data.stockItem.status || 'active'
      });
    }
  }
  
  loadProducts(): void {
    this.productsLoading = true;
    this.productsService.getAllProducts()
      .pipe(finalize(() => this.productsLoading = false))
      .subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.showSnackBar('STOCK_ITEMS.ERROR.LOADING_PRODUCTS');
        }
      });
  }

save(): void {
  if (this.stockItemForm.invalid) {
    return;
  }
  
  this.loading = true;
  const stockItemData = this.stockItemForm.value as WarehouseStockItemData;
  
  if (this.isNew) {
    this.stockItemsService.createStockItem(stockItemData).subscribe({
      next: () => {
        this.showSnackBar('STOCK_ITEMS.SUCCESS.CREATED');
        this.dialogRef.close(true);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating stock item:', error);
        this.showSnackBar('STOCK_ITEMS.ERROR.CREATE');
        this.loading = false;
      }
    });
  } else {
    if (!this.data.stockItem) {
      console.error('Stock item is undefined');
      this.showSnackBar('STOCK_ITEMS.ERROR.UPDATE');
      this.loading = false;
      return;
    }
    
    const updateId = this.data.stockItem.warehouse_stock_item_id;
    
    if (!updateId) {
      console.error('Missing stock item ID for update');
      this.showSnackBar('STOCK_ITEMS.ERROR.UPDATE');
      this.loading = false;
      return;
    }
    
    this.stockItemsService.updateStockItem(updateId, stockItemData).subscribe({
      next: () => {
        this.showSnackBar('STOCK_ITEMS.SUCCESS.UPDATED');
        this.dialogRef.close(true);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating stock item:', error);
        this.showSnackBar('STOCK_ITEMS.ERROR.UPDATE');
        this.loading = false;
      }
    });
  }
}

  close(): void {
    this.dialogRef.close();
  }

  private showSnackBar(messageKey: string): void {
    this.translate.get(messageKey).subscribe(message => {
      this.snackBar.open(message, this.translate.instant('COMMON.CLOSE'), {
        duration: 3000
      });
    });
  }
}