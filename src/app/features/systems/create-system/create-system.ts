// create-system.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SystemService } from '../../../core/api/system-service';
import { TokenService } from '../../../core/auth/token-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-system',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-system.html',
  styleUrl: './create-system.scss',
})
export class CreateSystem implements OnInit {
  systemForm!: FormGroup;
  loading = false;

  constructor(
    private systemService: SystemService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('CreateSystem component initialized');
    console.log('Is authenticated?', this.tokenService.isTokenValid());

    if (!this.tokenService.isTokenValid()) {
      console.log('Not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    this.systemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  onSubmit() {
    if (this.systemForm.valid) {
      this.systemForm.disable();
      this.loading = true;

      const systemData = {
        name: this.systemForm.value.name ?? '',
        description: this.systemForm.value.description ?? ''
      };

      this.systemService.createSystem(systemData).subscribe({
        next: (response) => {
          console.log('System created successfully', response);
          
          Swal.fire({
            icon: 'success',
            title: 'System Created',
            text: 'Redirecting to Systems List',
            showConfirmButton: false,
            timer: 1500
          });
          
          this.systemForm.reset();
          this.systemForm.enable();
          this.loading = false;
          
          setTimeout(() => {
            console.log('Attempting navigation to /systems');
            this.router.navigate(['/systems']).then(success => {
              console.log('Navigation result:', success);
              if (!success) {
                console.error('Navigation failed - check if route exists');
                window.location.href = '/systems';
              }
            });
          }, 1500);
        },
        error: (err) => {
          console.error('System creation error', err);
          this.systemForm.enable();
          this.loading = false;
          
          Swal.fire({
            icon: 'error',
            title: 'Creation Failed',
            text: err.message || 'Something went wrong!',
            confirmButtonText: 'Try Again'
          });
        }
      });
    } else {
      console.log('Form is invalid');
      Object.keys(this.systemForm.controls).forEach(key => {
        const control = this.systemForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
      });
      
      // Mark all fields as touched to show validation errors
      Object.values(this.systemForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/systems']);
  }
}