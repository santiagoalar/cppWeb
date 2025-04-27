import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductsService } from 'src/app/modules/services/products.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManufacturerService } from 'src/app/modules/services/manufacturers.service';
import { ManufacturerData } from 'src/app/models/manufacturer-data.model';
import { ProductData } from 'src/app/models/product-data.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-product-form-modal',
  templateUrl: './product-form-modal.component.html',
  styleUrls: ['./product-form-modal.component.scss'],
  animations: [
        trigger('fadeIn', [
          transition(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ]
})
export class ProductFormModalComponent implements OnInit {
  productForm!: FormGroup;
  manufacturers: ManufacturerData[] = [];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private manufacturerService: ManufacturerService,
    private dialogRef: MatDialogRef<ProductFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: ProductData
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      manufacturerId: ['', Validators.required],
      description: [''],
      details: this.fb.array([ this.createDetailGroup() ]),
      storageConditions: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      currency: ['', Validators.required],
      deliveryTime: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      images: this.fb.array([ this.fb.control('', [Validators.required, Validators.pattern(/https?:\/\/.+/)]) ])
    });
    this.manufacturerService.getAllManufacturers().subscribe({
      next: (list) => this.manufacturers = list,
      error: (err) => console.error('Error loading manufacturers', err)
    });
    if (this.data) {
      this.productForm.patchValue({
        name: this.data.name,
        brand: this.data.brand,
        manufacturerId: this.data.manufacturerId,
        description: this.data.description,
        storageConditions: this.data.storageConditions,
        price: this.data.price,
        currency: this.data.currency,
        deliveryTime: this.data.deliveryTime,
        stock: this.data.stock
      });
      this.details.clear();
      Object.entries(this.data.details).forEach(([key, value]) => {
        this.details.push(this.fb.group({ key: [key, Validators.required], value: [value, Validators.required] }));
      });
      this.images.clear();
      this.data.images.forEach(imgUrl => {
        this.images.push(this.fb.control(imgUrl, [Validators.required, Validators.pattern(/https?:\/\/.+/)]));
      });
    }
  }

  createDetailGroup(): FormGroup {
    return this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  get details(): FormArray {
    return this.productForm.get('details') as FormArray;
  }

  addDetail(): void {
    this.details.push(this.createDetailGroup());
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
  }

  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  addImage(): void {
    this.images.push(this.fb.control('', [Validators.required, Validators.pattern(/https?:\/\/.+/)]));
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
  }

  onSave(): void {
    if (this.productForm.invalid) {
      return;
    }
    const formValue = this.productForm.value;
    const detailsArray = formValue.details as { key: string; value: string }[];
    const detailsMap: Record<string, string> = {};
    detailsArray.forEach(item => {
      detailsMap[item.key] = item.value;
    });
    const productData: any = {
      ...formValue,
      details: detailsMap
    };
    if (this.data?.id) {
      this.productsService.updateProduct(this.data.id, productData).subscribe({
        next: () => this.dialogRef.close(true),
        error: err => console.error('Error updating product', err)
      });
    } else {
      this.productsService.createProduct(productData).subscribe({
        next: () => this.dialogRef.close(true),
        error: err => console.error('Error creating product', err)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}