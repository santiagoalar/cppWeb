import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { RouteData } from 'src/app/models/routes-data.model';
import { RoutesService } from '../services/routes.service';
import { RoutesDetailsModalComponent } from './routes-details-modal/routes-details-modal.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class RoutesComponent implements OnInit {
  routes: RouteData[] = [];
  loading = false;
  userId: string = '';

  constructor(
    private routesService: RoutesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
    this.loadRoutes();
  }

  loadRoutes(): void {
    this.loading = true;
    this.routesService.getUserRoutes(this.userId).subscribe({
      next: (routes) => {
        this.routes = routes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading routes:', error);
        this.loading = false;
        this.showSnackBar('routes.errorLoadingRoutes');
      }
    });
  }

  openCreateRouteModal(): void {
    const dialogRef = this.dialog.open(RoutesDetailsModalComponent, {
      width: '1200px',
      maxWidth: '1200px',
      data: {
        route: {
          user_id: this.userId,
          name: '',
          description: '',
          zone: '',
          due_to: new Date().toISOString(),
          waypoints: []
        },
        isEditMode: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.routesService.createRoute(result).subscribe({
          next: () => {
            this.loadRoutes();
            this.showSnackBar('routes.routeCreatedSuccess');
          },
          error: (error) => {
            console.error('Error creating route:', error);
            this.loading = false;
            this.showSnackBar('routes.errorCreatingRoute');
          }
        });
      }
    });
  }

  viewRouteDetails(route: RouteData): void {
    this.dialog.open(RoutesDetailsModalComponent, {
      width: '1200px',
      data: { route, isEditMode: false }
    });
  }

  editRoute(route: RouteData): void {
    const dialogRef = this.dialog.open(RoutesDetailsModalComponent, {
      width: '1200px',
      data: { route: { ...route }, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.routesService.updateRoute(route.id!, result).subscribe({
          next: () => {
            this.loadRoutes();
            this.showSnackBar('routes.routeUpdatedSuccess');
          },
          error: (error) => {
            console.error('Error updating route:', error);
            this.loading = false;
            this.showSnackBar('routes.errorUpdatingRoute');
          }
        });
      }
    });
  }

  deleteRoute(route: RouteData): void {
    this.loading = true;
    this.routesService.deleteRoute(route.id!).subscribe({
      next: () => {
        this.routes = this.routes.filter(r => r.id !== route.id);
        this.loading = false;
        this.showSnackBar('routes.routeDeletedSuccess');
      },
      error: (error) => {
        console.error('Error deleting route:', error);
        this.loading = false;
        this.showSnackBar('routes.errorDeletingRoute');
      }
    });
  }

  private showSnackBar(messageKey: string): void {
    this.snackBar.open(
      this.translate.instant(messageKey),
      this.translate.instant('common.close'),
      { duration: 3000 }
    );
  }
}