import { Component } from '@angular/core';
import { LoginService } from '../../../core/auth/login-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

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
    private fb: FormBuilder
  ){}
  
  ngOnInit(): void {
    
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      systemId: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {

      this.loginService.authenticate(
        this.loginForm.value.username ?? '',
        this.loginForm.value.password,
        this.loginForm.value.systemId).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Task has been saved',
            showConfirmButton: false,
            timer: 1500
          })
            this.loginForm.reset();
  
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
        });
    }
  }
}
