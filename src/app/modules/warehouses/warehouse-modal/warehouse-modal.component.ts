import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { WarehousesService } from '../../services/warehouses.service';
import { WarehouseData } from 'src/app/models/warehouse-data.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-warehouse-modal',
  templateUrl: './warehouse-modal.component.html',
  styleUrls: ['./warehouse-modal.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class WarehouseModalComponent implements OnInit {
  warehouseForm: FormGroup;
  isNew: boolean;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<WarehouseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isNew: boolean, warehouse?: WarehouseData },
    private warehousesService: WarehousesService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private auth: AuthService
  ) {
    this.isNew = data.isNew;
    this.warehouseForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      administrator_id: ['', Validators.required],
      status: ['active']
    });
  }

  ngOnInit(): void {
    if (!this.isNew && this.data.warehouse) {
      this.warehouseForm.patchValue({
        name: this.data.warehouse.name,
        location: this.data.warehouse.location,
        description: this.data.warehouse.description,
        administrator_id: this.data.warehouse.administrator_id,
        status: this.data.warehouse.status || 'active'
      });
    } else {
      this.warehouseForm.patchValue({
        administrator_id: localStorage.getItem('userId') || ''
      });
    }
  }

  save(): void {
    if (this.warehouseForm.invalid) {
      return;
    }
    
    this.loading = true;
    const warehouseData = this.warehouseForm.value as WarehouseData;
    
    if (this.isNew) {
      this.warehousesService.createWarehouse(warehouseData).subscribe({
        next: () => {
          this.showSnackBar('WAREHOUSES.SUCCESS.CREATED');
          this.dialogRef.close(true);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating warehouse:', error);
          this.showSnackBar('WAREHOUSES.ERROR.CREATE');
          this.loading = false;
        }
      });
    } else {
      this.warehousesService.updateWarehouse(this.data.warehouse?.id || '', warehouseData).subscribe({
        next: () => {
          this.showSnackBar('WAREHOUSES.SUCCESS.UPDATED');
          this.dialogRef.close(true);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating warehouse:', error);
          this.showSnackBar('WAREHOUSES.ERROR.UPDATE');
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