import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouteData, Waypoint } from 'src/app/models/routes-data.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-routes-details-modal',
  templateUrl: './routes-details-modal.component.html',
  styleUrls: ['./routes-details-modal.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class RoutesDetailsModalComponent implements OnInit {
  routeForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RoutesDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { route: RouteData; isEditMode: boolean }
  ) {
    this.isEditMode = data.isEditMode;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.routeForm = this.fb.group({
      name: [{ value: this.data.route.name, disabled: !this.isEditMode }, Validators.required],
      description: [{ value: this.data.route.description, disabled: !this.isEditMode }],
      zone: [{ value: this.data.route.zone, disabled: !this.isEditMode }, Validators.required],
      due_to: [{ value: new Date(this.data.route.due_to), disabled: !this.isEditMode }],
      user_id: [this.data.route.user_id],
      waypoints: this.fb.array([])
    });

    // Add existing waypoints to the form array
    if (this.data.route.waypoints && this.data.route.waypoints.length > 0) {
      this.data.route.waypoints.forEach(waypoint => {
        this.waypointsArray.push(this.createWaypointFormGroup(waypoint));
      });
    }
  }

  get waypointsArray(): FormArray {
    return this.routeForm.get('waypoints') as FormArray;
  }

  createWaypointFormGroup(waypoint?: Waypoint): FormGroup {
    return this.fb.group({
      name: [{ value: waypoint?.name || '', disabled: !this.isEditMode }, Validators.required],
      address: [{ value: waypoint?.address || '', disabled: !this.isEditMode }, Validators.required],
      latitude: [{ value: waypoint?.latitude || 0, disabled: !this.isEditMode }, [Validators.required]],
      longitude: [{ value: waypoint?.longitude || 0, disabled: !this.isEditMode }, [Validators.required]]
    });
  }

  addWaypoint(): void {
    if (this.isEditMode) {
      this.waypointsArray.push(this.createWaypointFormGroup());
    }
  }

  removeWaypoint(index: number): void {
    if (this.isEditMode) {
      this.waypointsArray.removeAt(index);
    }
  }

  save(): void {
    if (this.routeForm.valid) {
      const formValue = this.routeForm.getRawValue();
      
      const updatedRoute: RouteData = {
        ...this.data.route,
        name: formValue.name,
        description: formValue.description,
        zone: formValue.zone,
        due_to: formValue.due_to.toISOString(),
        user_id: formValue.user_id,
        waypoints: formValue.waypoints
      };
      
      this.dialogRef.close(updatedRoute);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}