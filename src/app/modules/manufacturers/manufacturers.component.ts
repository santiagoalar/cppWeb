import { Component, OnInit } from '@angular/core';
import { ManufacturerData } from 'src/app/models/manufacturer-data.model';
import { ManufacturerService } from 'src/app/modules/services/manufacturers.service';
import { MatDialog } from '@angular/material/dialog';
import { ManufacturersModalComponent } from 'src/app/modules/manufacturers/manufacturers-modal/manufacturers-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.scss'],
    animations: [
      trigger('fadeIn', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
    ]
})
export class ManufacturersComponent implements OnInit {
  manufacturers: ManufacturerData[] = [];
  searchId: string = '';
  searchNit: string = '';

  displayedColumns: string[] = [
    'name', 'nit', 'address', 'phone', 'email',
    'legal_representative', 'country', 'status', 'actions'
  ];

  constructor(
    private manufacturerService: ManufacturerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.getManufacturers();
  }

  getManufacturers(): void {
    this.manufacturerService.getAllManufacturers().subscribe((data: ManufacturerData[]) => {
      this.manufacturers = data;
    });
  }

  openCreateModal(data?: ManufacturerData): void {
    const dialogRef = this.dialog.open(ManufacturersModalComponent, {
      width: '400px',
      data: data || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'refresh') {
        this.getManufacturers();
      }
    });
  }

  searchById(): void {
    if (!this.searchId) return;
    this.manufacturerService.getManufacturerById(this.searchId).subscribe({
      next: (data) => {
        this.openCreateModal(data);
      },
      error: (err) => {
        const message = err?.error?.msg || this.translate.instant('manufacturers.notFoundById');
        this.snackBar.open(message, this.translate.instant('common.close'), {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  searchByNit(): void {
    if (!this.searchNit) return;
    this.manufacturerService.getManufacturerByNit(this.searchNit).subscribe({
      next: (data) => {
        this.openCreateModal(data);
      },
      error: (err) => {
        const message = err?.error?.msg || this.translate.instant('manufacturers.notFoundByNit');
        this.snackBar.open(message, this.translate.instant('common.close'), {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  deleteManufacturer(id: string): void {
    this.manufacturerService.deleteManufacturer(id).subscribe({
      next: () => {
        this.getManufacturers();
        this.snackBar.open(
          this.translate.instant('manufacturers.deleteSuccess'),
          this.translate.instant('common.close'),
          {
            duration: 3000,
            panelClass: ['snackbar-success']
          }
        );
      },
      error: (err) => {
        const message = err?.error?.msg || this.translate.instant('manufacturers.deleteError');
        this.snackBar.open(message, this.translate.instant('common.close'), {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  isDirectivo(): boolean {
    return this.auth.isUserDirectivo();
  }
}