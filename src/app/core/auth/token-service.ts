// token.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../model/token-payload';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  
  getDecodedToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  getTokenExpiration(): Date | null {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) return null;
    
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate;
  }
  
  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return true;
    
    const bufferMs = 5 * 60 * 1000; // 5 minutes
    return new Date().getTime() + bufferMs > expiration.getTime();
  }
  
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    return !this.isTokenExpired();
  }
  
  getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded) return [];
    
    return decoded.roles || []; 
  }
  
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }
  
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }
  
  getUsername(): string | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;
    
    return decoded.sub || null;
  }
  
  getRemainingTime(): number {
    const expiration = this.getTokenExpiration();
    if (!expiration) return 0;
    
    const remaining = expiration.getTime() - new Date().getTime();
    return remaining > 0 ? remaining : 0;
  }
  getFormattedRemainingTime(): string {
    const remainingMs = this.getRemainingTime();
    if (remainingMs <= 0) return 'Expired';
    
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
  
  clearToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
    sessionStorage.removeItem('token');
  }
  
  setToken(token: string, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', token);
    
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.exp) {
        storage.setItem('token_expiration', decoded.exp.toString());
      }
    } catch (error) {
      console.error('Error storing token expiration:', error);
    }
  }
  

  getTokenData(): TokenPayload | null {
    return this.getDecodedToken();
  }
}