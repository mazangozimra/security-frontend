import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../core/auth/login-service';
import { TokenService } from '../../../core/auth/token-service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{
  
   username: string = '';
  userRoles: string[] = [];
  tokenExpiry: Date | null = null;
   sidebarOpen: boolean = true; // Add this property
  userMenuOpen: boolean = false; // Add this property
  currentPageTitle: string = 'Dashboard'; // Add this property

  // Count properties
  systemCount: number = 0;
  roleCount: number = 0;
  userCount: number = 0;
  departmentCount: number = 0;
  notificationCount: number = 3;

  private routerSubscription: Subscription | undefined;

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
    });
  }

  ngOnInit(): void {
    console.log('Dashboard initialized');
    const decodedToken = this.tokenService.getDecodedToken();
    this.username = decodedToken?.sub || localStorage.getItem('username') || 'User';
    this.userRoles = this.tokenService.getUserRoles();
    this.tokenExpiry = this.tokenService.getTokenExpiration();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }



  loadCounts(): void {
    this.systemCount = 5;
    this.roleCount = 12;
    this.userCount = 48;
    this.departmentCount = 4;
  }

  updatePageTitle(): void {
    const currentUrl = this.router.url;
    switch (currentUrl) {
      case '/dashboard':
        this.currentPageTitle = 'Dashboard';
        break;
      case '/systems':
        this.currentPageTitle = 'Systems Management';
        break;
      case '/roles':
        this.currentPageTitle = 'Roles Management';
        break;
      case '/users':
        this.currentPageTitle = 'Users Management';
        break;
      case '/departments':
        this.currentPageTitle = 'Departments Management';
        break;
      case '/profile':
        this.currentPageTitle = 'My Profile';
        break;
      case '/settings':
        this.currentPageTitle = 'Settings';
        break;
      default:
        if (currentUrl.includes('/systems/')) this.currentPageTitle = 'System Details';
        if (currentUrl.includes('/roles/')) this.currentPageTitle = 'Role Details';
        if (currentUrl.includes('/users/')) this.currentPageTitle = 'User Details';
        break;
    }
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      if (this.sidebarOpen) {
        sidebar.classList.remove('collapsed');
      } else {
        sidebar.classList.add('collapsed');
      }
    }
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

}
