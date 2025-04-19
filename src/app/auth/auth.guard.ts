import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const token = localStorage.getItem('token');

    if (!token) {
      return this.translate.get('ALERTS.SIGN_IN_FIRST').pipe(
        switchMap((message: string) => {
          this.snackBar.open(message, this.translate.instant('Close'), { 
            duration: 3000, 
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
          return of(this.router.createUrlTree(['/sign-in']));
        })
      );
    }

    return this.authService.validateToken(token).pipe(
      map(response => true),
      catchError(error => {
        return this.translate.get('ALERTS.SESSION_EXPIRED').pipe(
          switchMap((message: string) => {
            this.snackBar.open(message, this.translate.instant('Close'), { 
              duration: 3000, 
              verticalPosition: 'top',
              panelClass: ['snackbar-error']
            });
            return of(this.router.createUrlTree(['/sign-in']));
          })
        );
      })
    );
  }
}