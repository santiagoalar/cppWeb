import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductData } from 'src/app/models/product-data.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrls: ['./product-details-modal.component.scss'],
  animations: [
        trigger('fadeIn', [
          transition(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ]
})
export class ProductDetailsModalComponent implements OnInit {

  public imageIndex = 0;

  constructor(
    private dialogRef: MatDialogRef<ProductDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public product: ProductData
  ) {}

  ngOnInit(): void {}

  prevImage() {
    this.imageIndex = (this.imageIndex - 1 + this.product.images.length) % this.product.images.length;
  }

  nextImage() {
    this.imageIndex = (this.imageIndex + 1) % this.product.images.length;
  }

  onDelete() {
    this.dialogRef.close({ action: 'delete', id: this.product.id });
  }

  onUpdate() {
    this.dialogRef.close({ action: 'update', id: this.product.id });
  }

  onClose() {
    this.dialogRef.close();
  }

}