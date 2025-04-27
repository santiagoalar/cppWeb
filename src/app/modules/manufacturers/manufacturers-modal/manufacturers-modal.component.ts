import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManufacturerService } from 'src/app/modules/services/manufacturers.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-manufacturers-modal',
  templateUrl: './manufacturers-modal.component.html',
  styleUrls: ['./manufacturers-modal.component.scss'],
    animations: [
      trigger('fadeIn', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
    ]
})
export class ManufacturersModalComponent implements OnInit {
  manufacturerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private manufacturerService: ManufacturerService,
    public dialogRef: MatDialogRef<ManufacturersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private clipboard: Clipboard,
  ) { }

  ngOnInit(): void {
    this.manufacturerForm = this.fb.group({
      name: ['', Validators.required],
      nit: ['', [Validators.required, Validators.pattern(/^\d{9}-\d$/)]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(7)]],
      email: ['', [Validators.required, Validators.email]],
      legal_representative: ['', Validators.required],
      country: ['', Validators.required],
      status: ['', Validators.required]
    });

    if (this.data) {
      this.manufacturerForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.manufacturerForm.valid) {
      const payload = this.manufacturerForm.value;
      if (this.data?.id) {
        this.manufacturerService.updateManufacturer(this.data.id, payload).subscribe({
          next: () => this.dialogRef.close('refresh'),
          error: (error) => this.showError(error)
        });
      } else {
        this.manufacturerService.createManufacturer(payload).subscribe({
          next: () => this.dialogRef.close('refresh'),
          error: (error) => this.showError(error)
        });
      }
    }
  }

  private showError(error: any) {
    const errorMessage = error?.error?.msg || error?.error?.message || this.translate.instant('manufacturerModal.genericError');
    this.snackBar.open(errorMessage, this.translate.instant('common.close'), {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar-error']
    });
  }

  onCancel() {
    this.manufacturerForm.reset();
    this.dialogRef.close();
  }

  copyId(): void {
    if (this.data?.id) {
      this.clipboard.copy(this.data.id);
    }
  }
}