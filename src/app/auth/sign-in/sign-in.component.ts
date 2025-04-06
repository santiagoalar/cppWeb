import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';

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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

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
        next: (response) => {
          this.signInErrorMessage = null;
          console.log('Authentication success:', response);
          this.router.navigate(['/main-page']);
        },
        error: (error) => {
          this.signInErrorMessage = 'Invalid email or password';
          console.error('Authentication failed:', error);
        }
      });
    }
  }
}