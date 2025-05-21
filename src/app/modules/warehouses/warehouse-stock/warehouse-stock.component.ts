import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseStockItemsService } from 'src/app/modules/services/warehouses-stock-items.service';
import { WarehouseStockItemData } from 'src/app/models/warehouse-stock-items-data.model';
import { WarehouseData } from 'src/app/models/warehouse-data.model';
import { StockItemModalComponent } from '../stock-item-modal/stock-item-modal.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-warehouse-stock',
  templateUrl: './warehouse-stock.component.html',
  styleUrls: ['./warehouse-stock.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class WarehouseStockComponent implements OnInit {
  stockItems: WarehouseStockItemData[] = [];
  loading: boolean = false;
  displayedColumns: string[] = ['item_id', 'bar_code', 'hallway', 'shelf', 'dimensions', 'weight', 'sold', 'status', 'actions'];

  constructor(
    private dialogRef: MatDialogRef<WarehouseStockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { warehouse: WarehouseData },
    private stockItemsService: WarehouseStockItemsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loadStockItems();
  }

  loadStockItems(): void {
    this.loading = true;
    this.stockItemsService.getStockItemsByWarehouseId(this.data.warehouse.warehouse_id).subscribe({
      next: (items) => {
        this.stockItems = items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stock items:', error);
        this.loading = false;
        this.showSnackBar('STOCK_ITEMS.ERROR.LOADING');
      }
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(StockItemModalComponent, {
      width: '600px',
      data: {
        isNew: true,
        warehouseId: this.data.warehouse.warehouse_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStockItems();
      }
    });
  }

  openEditModal(stockItem: WarehouseStockItemData): void {
    const dialogRef = this.dialog.open(StockItemModalComponent, {
      width: '600px',
      data: {
        isNew: false,
        stockItem,
        warehouseId: this.data.warehouse.warehouse_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStockItems();
      }
    });
  }

  deleteStockItem(stockItem: WarehouseStockItemData): void {
    // Use warehouse_stock_item_id instead of id
    const deleteId = stockItem.warehouse_stock_item_id;

    if (!deleteId) {
      console.error('Missing stock item ID for delete');
      this.showSnackBar('STOCK_ITEMS.ERROR.DELETE');
      return;
    }

    this.loading = true;
    this.stockItemsService.deleteStockItem(deleteId).subscribe({
      next: () => {
        this.loadStockItems();
        this.showSnackBar('STOCK_ITEMS.SUCCESS.DELETED');
      },
      error: (error) => {
        console.error('Error deleting stock item:', error);
        this.loading = false;
        this.showSnackBar('STOCK_ITEMS.ERROR.DELETE');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  isAdmin(): boolean {
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