import { Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
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
export class RoutesDetailsModalComponent implements OnInit, AfterViewInit {
  routeForm!: FormGroup;
  isEditMode: boolean = false;
  map: google.maps.Map | null = null;
  markers: google.maps.Marker[] = [];
  activateMapSelect: boolean = false;
  activeWaypointIndex: number | null = null;

  @ViewChild('routeMap', { static: false }) mapElement!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<RoutesDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { route: RouteData; isEditMode: boolean }
  ) {
    this.isEditMode = data.isEditMode;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  initForm(): void {
    this.routeForm = this.fb.group({
      name: [{ value: this.data.route.name, disabled: !this.isEditMode }, Validators.required],
      description: [{ value: this.data.route.description, disabled: !this.isEditMode }],
      zone: [{ value: this.data.route.zone, disabled: !this.isEditMode }, Validators.required],
      due_to: [{ value: new Date(this.data.route.due_to), disabled: !this.isEditMode }],
      waypoints: this.fb.array([]),
      assignToMe: [true],
      user_id: [{ value: localStorage.getItem('userId'), disabled: true }, Validators.required]
    });

    if (this.data.route.waypoints && this.data.route.waypoints.length > 0) {
      this.data.route.waypoints.forEach(waypoint => {
        this.waypointsArray.push(this.createWaypointFormGroup(waypoint));
      });
    }
  }

  handleAssignmentChange(): void {
    const assignToMe = this.routeForm.get('assignToMe')?.value;

    if (assignToMe) {
      this.routeForm.get('user_id')?.setValue(localStorage.getItem('userId'));
      this.routeForm.get('user_id')?.disable();
    } else {
      this.routeForm.get('user_id')?.setValue('');
      this.routeForm.get('user_id')?.enable();
    }
  }

  initMap(): void {
    const mapDiv = document.getElementById('route-map');
    if (!mapDiv) return;

    let center = { lat: 4.710989, lng: -74.072092 };

    if (this.waypointsArray.length > 0) {
      const firstWaypoint = this.waypointsArray.at(0).value;
      center = {
        lat: firstWaypoint.latitude || center.lat,
        lng: firstWaypoint.longitude || center.lng
      };
    }

    this.map = new google.maps.Map(mapDiv, {
      zoom: 12,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true
    });

    this.updateMapMarkers();

    if (this.isEditMode && this.map) {
      this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (this.activateMapSelect && event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();

          if (this.activeWaypointIndex !== null) {
            this.setWaypointLocation(this.activeWaypointIndex, lat, lng);
            this.activeWaypointIndex = null;
            this.activateMapSelect = false;
          } else if (this.activateMapSelect) {
            this.addWaypointWithCoordinates(lat, lng);
            this.activateMapSelect = false;
          }
        }
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
      this.updateMapMarkers();
    }
  }

  removeWaypoint(index: number): void {
    if (this.isEditMode) {
      this.waypointsArray.removeAt(index);
      this.updateMapMarkers();
    }
  }

  selectLocationOnMap(index: number): void {
    this.activateMapSelect = true;
    this.activeWaypointIndex = index;
  }

  addWaypointFromMap(): void {
    this.activateMapSelect = true;
    this.activeWaypointIndex = null;
  }

  addWaypointWithCoordinates(lat: number, lng: number): void {
    if (this.isEditMode) {
      this.getAddressFromCoordinates(lat, lng).then(address => {
        const newWaypoint: Waypoint = {
          name: address?.split(',')[0] || `Location ${this.waypointsArray.length + 1}`,
          address: address || '',
          latitude: lat,
          longitude: lng
        };

        this.waypointsArray.push(this.createWaypointFormGroup(newWaypoint));
        this.updateMapMarkers();
      });
    }
  }

  setWaypointLocation(index: number, lat: number, lng: number): void {
    if (this.isEditMode && index >= 0 && index < this.waypointsArray.length) {
      const waypointGroup = this.waypointsArray.at(index) as FormGroup;

      this.getAddressFromCoordinates(lat, lng).then(address => {
        this.ngZone.run(() => {
          waypointGroup.patchValue({
            latitude: lat,
            longitude: lng,
            address: address || waypointGroup.get('address')?.value
          });
          this.updateMapMarkers();
        });
      });
    }
  }

  getAddressFromCoordinates(lat: number, lng: number): Promise<string | null> {
    return new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat, lng };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve(null);
        }
      });
    });
  }

  updateMapMarkers(): void {
    if (!this.map) return;

    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    const bounds = new google.maps.LatLngBounds();
    const waypoints = this.waypointsArray.controls;

    waypoints.forEach((waypointGroup: any, index: number) => {
      const waypoint = waypointGroup.getRawValue();
      const position = {
        lat: waypoint.latitude,
        lng: waypoint.longitude
      };

      if (!position.lat || !position.lng) return;

      const marker = new google.maps.Marker({
        position,
        map: this.map,
        title: waypoint.name,
        label: `${index + 1}`,
        draggable: this.isEditMode
      });

      if (this.isEditMode) {
        marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            this.setWaypointLocation(index, lat, lng);
          }
        });
      }

      this.markers.push(marker);
      bounds.extend(position);
    });

    if (waypoints.length > 0) {
      this.map.fitBounds(bounds);

      if (this.map.getZoom()! > 16) {
        this.map.setZoom(16);
      }
    }

    if (waypoints.length > 1) {
      const pathCoordinates = waypoints.map((waypointGroup: any) => {
        const waypoint = waypointGroup.getRawValue();
        return {
          lat: waypoint.latitude,
          lng: waypoint.longitude
        };
      });

      const routePath = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      routePath.setMap(this.map);
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
        waypoints: formValue.waypoints,
      };

      this.dialogRef.close(updatedRoute);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}