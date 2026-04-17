import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemService } from '../../../core/api/system-service';
import { SystemModel } from '../../../core/model/system-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-system',
  imports: [],
  templateUrl: './create-system.html',
  styleUrl: './create-system.scss',
})
export class CreateSystem  implements OnInit{// create-system.component.ts

  systemForm: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private systemService: SystemService,
    private router: Router
  ) {
    this.systemForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      type: ['', Validators.required],
      status: ['active', Validators.required],
      version: ['1.0.0', Validators.required]
    });
  }

  ngOnInit(): void {}

  get f() { return this.systemForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;
    this.successMessage = null;

    if (this.systemForm.invalid) {
      return;
    }

    this.loading = true;

    const systemData: SystemModel = {
      name: this.f['name'].value,
      description: this.f['description'].value
    };

    this.systemService.createSystem(systemData).subscribe({
      next: (response) => {
        console.log('System created successfully:', response.data);
        this.successMessage = `System "${response.data}" created successfully!`;
        this.loading = false;
        this.submitted = false;
        this.systemForm.reset();
        
        // Reset form with default values
        this.systemForm.patchValue({
          status: 'active',
          version: '1.0.0'
        });
        
        // Optionally redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/systems']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.message || 'Failed to create system. Please try again.';
        this.loading = false;
        console.error('Error creating system:', err);
      }
    });
  }

  resetForm(): void {
    this.systemForm.reset();
    this.submitted = false;
    this.error = null;
    this.successMessage = null;
    this.systemForm.patchValue({
      status: 'active',
      version: '1.0.0'
    });
  }
}