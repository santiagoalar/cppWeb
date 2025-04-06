import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.errorMessage = '';

      const body = {
        name: this.signUpForm.value.username,
        phone: this.signUpForm.value.phone,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
        role: this.signUpForm.value.role
      };

      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post('http://localhost:5001/bff/v1/web/users/', body, { headers })
        .subscribe({
          next: (res) => {
            console.log('Usuario registrado con éxito', res);
            this.router.navigate(['/sign-in']);
          },
          error: (err) => {
            console.error('Error al registrar usuario', err);
            this.errorMessage = 'Hubo un error al registrar el usuario. Intenta nuevamente.';
          }
        });
    }
  }
}
