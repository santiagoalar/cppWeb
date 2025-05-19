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
  loading: boolean = false;

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
    this.loading = true;
    this.manufacturerService.getAllManufacturers().subscribe({
      next: (data: ManufacturerData[]) => {
        this.manufacturers = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching manufacturers:', error);
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('manufacturers.loadError'),
          this.translate.instant('common.close'),
          {
            duration: 5000,
            panelClass: ['snackbar-error']
          }
        );
      }
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
    this.loading = true;
    this.manufacturerService.getManufacturerById(this.searchId).subscribe({
      next: (data) => {
        this.loading = false;
        this.openCreateModal(data);
      },
      error: (err) => {
        this.loading = false;
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
    this.loading = true;
    this.manufacturerService.getManufacturerByNit(this.searchNit).subscribe({
      next: (data) => {
        this.loading = false;
        this.openCreateModal(data);
      },
      error: (err) => {
        this.loading = false;
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
    this.loading = true;
    this.manufacturerService.deleteManufacturer(id).subscribe({
      next: () => {
        this.getManufacturers(); // This will reset loading state after fetching
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
        this.loading = false;
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