import { Component } from '@angular/core';
import { LoginService } from '../../../core/auth/login-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  loginForm!: FormGroup;

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router
  ){}
  
  ngOnInit(): void {
    
    console.log('Login component initialized');
    console.log('Is authenticated?', this.loginService.isAuthenticated());

    if (this.loginService.isAuthenticated()) {
      console.log('Already authenticated, redirecting to dashboard');
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      systemId: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {

      this.loginForm.disable();

      this.loginService.authenticate(
        this.loginForm.value.username ?? '',
        this.loginForm.value.password,
        this.loginForm.value.systemId
      ).subscribe({
        next: (response) => {
          console.log('Authentication successful, navigating to dashboard');
          
          Swal.fire({
            icon: 'success',
            title: 'Login successful',
            text: 'Redirecting to Dashboard',
            showConfirmButton: false,
            timer: 1500
          });
          
          this.loginForm.reset();
          this.loginForm.enable();
          
          setTimeout(() => {
            console.log('Attempting navigation to /dashboard');
            this.router.navigate(['/dashboard']).then(success => {
              console.log('Navigation result:', success);
              if (success) {
                console.log('Successfully navigated to dashboard');
              } else {
                console.error('Navigation failed - check if route exists');
                // Fallback: try window.location
                window.location.href = '/dashboard';
              }
            });
          }, 1500);
        },
        error: (err) => {
          console.error('Authentication error', err);
          this.loginForm.enable();
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: err.message || 'Something went wrong!',
            confirmButtonText: 'Try Again'
          });
        }
      });
    } else {
      console.log('Form is invalid');
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
      });
    }
  }
}