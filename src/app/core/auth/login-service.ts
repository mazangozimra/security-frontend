import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginModel } from '../model/login-model';
import { throwError } from 'rxjs/internal/observable/throwError';
import { TokenService } from './token-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private baseUrl = 'http://localhost:7004';
  
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}
  
  authenticate(username: string, password: string, systemId: number, rememberMe: boolean = false): Observable<LoginModel> {
    
    let params = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('systemId', systemId.toString());

    return this.http.post<LoginModel>(`${this.baseUrl}/authenticate`, null, {
      params: params,
      headers: this.httpOptions.headers
    })
      .pipe(
        tap((response: LoginModel) => {
          if (response.token) {
            this.tokenService.setToken(response.token, rememberMe);
            console.log('Token stored successfully');
            
            // Log decoded token info for debugging
            const decoded = this.tokenService.getDecodedToken();
            console.log('Token payload:', decoded);
            console.log('User roles:', this.tokenService.getUserRoles());
            console.log('Token expires:', this.tokenService.getTokenExpiration());
          }
        }),
        catchError(this.handleError)
      );
  }


  logout(): void {
    this.tokenService.clearToken();
    // Navigate to login page if needed
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('An error occurred:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
