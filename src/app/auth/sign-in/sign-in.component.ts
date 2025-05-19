import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;
  signInErrorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      const body = this.signInForm.value;
      this.authService.authenticateUser(body).subscribe({
        next: (response: any) => {
          this.signInErrorMessage = null;
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.id);
            this.authService.validateToken(response.token).subscribe({
              next: (validationResponse) => {
                if (validationResponse) {
                  localStorage.setItem('userRole', validationResponse.role);
                  localStorage.setItem('userName', validationResponse.name);
                }
                console.log('Token validation successful:', validationResponse);
                this.router.navigate(['/main-page']);
              },
              error: (validationError) => {
                console.error('Token validation failed:', validationError);
                localStorage.clear();
                this.signInErrorMessage = this.translate.instant('SIGN_IN_ERROR.TOKEN_VALIDATION_FAILED');
              }
            });
          } else {
            this.signInErrorMessage = this.translate.instant('SIGN_IN_ERROR.NO_TOKEN');
          }
        },
        error: (error) => {
          this.signInErrorMessage = this.translate.instant('SIGN_IN_ERROR.INVALID');
          console.error('Authentication failed:', error);
        }
      });
    }
  }
}