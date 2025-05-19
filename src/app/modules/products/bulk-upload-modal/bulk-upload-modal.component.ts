import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from '../../services/products.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-bulk-upload-modal',
  templateUrl: './bulk-upload-modal.component.html',
  styleUrls: ['./bulk-upload-modal.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class BulkUploadModalComponent {
  isHovering = false;
  selectedFile: File | null = null;
  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    public dialogRef: MatDialogRef<BulkUploadModalComponent>,
    private productsService: ProductsService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar
  ) { }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isHovering = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isHovering = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isHovering = false;

    if (event.dataTransfer && event.dataTransfer.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.handleFiles(input.files);
  }

  handleFiles(files: FileList | null): void {
    if (files && files.length > 0) {
      const file = files[0];
      if (this.validateFile(file)) {
        this.selectedFile = file;
        this.error = null;
      }
    }
  }

  validateFile(file: File): boolean {
    // Check file type
    if (!file.name.endsWith('.csv')) {
      this.error = this.translateService.instant('PRODUCTS.BULK_UPLOAD.ERROR.FILE_TYPE');
      return false;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.error = this.translateService.instant('PRODUCTS.BULK_UPLOAD.ERROR.FILE_SIZE');
      return false;
    }

    return true;
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.error = this.translateService.instant('PRODUCTS.BULK_UPLOAD.ERROR.NO_FILE');
      return;
    }

    this.loading = true;
    this.error = null;

    this.productsService.uploadProductsBulk(this.selectedFile)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.success = true;
          this.snackBar.open(
            this.translateService.instant('PRODUCTS.BULK_UPLOAD.SUCCESS'),
            this.translateService.instant('COMMON.CLOSE'),
            { duration: 5000 }
          );
          setTimeout(() => this.dialogRef.close(true), 1500);
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.error('Error uploading products', error);
          this.error = this.translateService.instant('PRODUCTS.BULK_UPLOAD.ERROR.UPLOAD_FAILED');
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  clearSelection(): void {
    this.selectedFile = null;
    this.error = null;
  }
}