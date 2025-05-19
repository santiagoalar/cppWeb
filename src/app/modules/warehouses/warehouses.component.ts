import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { WarehousesService } from '../services/warehouses.service';
import { WarehouseData } from 'src/app/models/warehouse-data.model';
import { WarehouseModalComponent } from './warehouse-modal/warehouse-modal.component';
import { WarehouseStockComponent } from './warehouse-stock/warehouse-stock.component';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class WarehousesComponent implements OnInit {
  warehouses: WarehouseData[] = [];
  loading: boolean = false;
  searchTerm: string = '';

  constructor(
    private warehousesService: WarehousesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.warehousesService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
        this.loading = false;
        this.showSnackBar('WAREHOUSES.ERROR.LOADING');
      }
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(WarehouseModalComponent, {
      width: '600px',
      data: { isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadWarehouses();
      }
    });
  }

  openEditModal(warehouse: WarehouseData): void {
    const dialogRef = this.dialog.open(WarehouseModalComponent, {
      width: '600px',
      data: { isNew: false, warehouse }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadWarehouses();
      }
    });
  }
  
  openStockModal(warehouse: WarehouseData): void {
    this.dialog.open(WarehouseStockComponent, {
      width: '900px',
      data: { warehouse }
    });
  }

  deleteWarehouse(id: string): void {
    if (confirm(this.translate.instant('WAREHOUSES.CONFIRM_DELETE'))) {
      this.loading = true;
      this.warehousesService.deleteWarehouse(id).subscribe({
        next: () => {
          this.loadWarehouses();
          this.showSnackBar('WAREHOUSES.SUCCESS.DELETED');
        },
        error: (error) => {
          console.error('Error deleting warehouse:', error);
          this.loading = false;
          this.showSnackBar('WAREHOUSES.ERROR.DELETE');
        }
      });
    }
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