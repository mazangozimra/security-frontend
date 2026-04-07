// token.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../model/token-payload';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  
  /**
   * Get the raw token from storage
   */
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  
  /**
   * Decode and get the token payload
   */
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
  
  /**
   * Get token expiration from the JWT itself
   */
  getTokenExpiration(): Date | null {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) return null;
    
    // exp is in seconds, convert to milliseconds
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate;
  }
  
  /**
   * Check if token is expired using JWT claims
   */
  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return true;
    
    // Add a small buffer (e.g., 5 minutes) for safety
    const bufferMs = 5 * 60 * 1000; // 5 minutes
    return new Date().getTime() + bufferMs > expiration.getTime();
  }
  
  /**
   * Validate token (exists, not expired, etc.)
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    return !this.isTokenExpired();
  }
  
  /**
   * Get user roles from token
   */
  getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded) return [];
    
    // Handle different role field names (roles, authorities, permissions, etc.)
    return decoded.roles || []; 
    //|| decoded.authorities || decoded.permissions || [];
  }
  
  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }
  
  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }
  
  /**
   * Get username from token
   */
  getUsername(): string | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;
    
    return decoded.sub || null;
    // decoded.sub || decoded.email || null;
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
    
    // Optional: Also store the decoded expiration for quick access
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