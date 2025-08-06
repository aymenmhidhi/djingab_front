import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../register/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [AuthService]
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  message = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\W_]).{8,}$')]
      ],
      cellPhone: [
        '',
        [Validators.required,
        Validators.pattern('^(\\+\\d{1,3})?\\d{10,15}$')]
      ]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => this.message = res,
      error: (err) => this.message = err.error.message || 'Erreur'
    });
  }
}

