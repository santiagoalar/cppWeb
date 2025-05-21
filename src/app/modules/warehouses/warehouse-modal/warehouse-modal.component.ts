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
  currentUserId: string;

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
    this.currentUserId = localStorage.getItem('userId') || '';
    
    // Initialize form with assignToMe control
    this.warehouseForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      administrator_id: ['', Validators.required],
      assignToMe: [true], // Default to true
      status: ['active']
    });
  }

  ngOnInit(): void {
    // Set initial form values
    if (!this.isNew && this.data.warehouse) {
      // For existing warehouse
      const isCurrentUserAdmin = this.data.warehouse.administrator_id === this.currentUserId;
      
      this.warehouseForm.patchValue({
        name: this.data.warehouse.name,
        location: this.data.warehouse.location,
        description: this.data.warehouse.description,
        administrator_id: this.data.warehouse.administrator_id,
        assignToMe: isCurrentUserAdmin,
        status: this.data.warehouse.status || 'active'
      });
    } else {
      // For new warehouse, set current user as administrator by default
      this.warehouseForm.patchValue({
        administrator_id: this.currentUserId
      });
    }
    
    // Initial state of administrator_id based on assignToMe value
    this.handleAdministratorAssignment();
  }

  handleAdministratorAssignment(): void {
    const assignToMe = this.warehouseForm.get('assignToMe')?.value;
    
    if (assignToMe) {
      this.warehouseForm.get('administrator_id')?.setValue(this.currentUserId);
      this.warehouseForm.get('administrator_id')?.disable();
    } else {
      this.warehouseForm.get('administrator_id')?.enable();
      // Only clear if it matches the current user, don't clear if it's set to someone else
      if (this.warehouseForm.get('administrator_id')?.value === this.currentUserId) {
        this.warehouseForm.get('administrator_id')?.setValue('');
      }
    }
  }

  save(): void {
    if (this.warehouseForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Enable administrator_id control so it's included in the form value
    this.warehouseForm.get('administrator_id')?.enable();
    
    // Get form value but exclude the assignToMe control which is just for UI
    const formValue = this.warehouseForm.value;
    
    const warehouseData: WarehouseData = {
      warehouse_id: this.isNew ? '' : this.data.warehouse!.warehouse_id, // Include warehouse_id
      name: formValue.name,
      location: formValue.location,
      description: formValue.description,
      administrator_id: formValue.administrator_id,
      status: formValue.status
    };
    
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
      this.warehousesService.updateWarehouse(this.data.warehouse!.warehouse_id, warehouseData).subscribe({
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