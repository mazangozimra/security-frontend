import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../core/auth/login-service';
import { TokenService } from '../../../core/auth/token-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{
  
   username: string = '';
  userRoles: string[] = [];
  tokenExpiry: Date | null = null;

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Dashboard initialized');
    const decodedToken = this.tokenService.getDecodedToken();
    this.username = decodedToken?.sub || localStorage.getItem('username') || 'User';
    this.userRoles = this.tokenService.getUserRoles();
    this.tokenExpiry = this.tokenService.getTokenExpiration();
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

}
