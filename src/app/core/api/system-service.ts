// systems.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { SystemModel } from '../model/system-model';
import { ApiResponse } from '../model/api-response';
import { TokenService } from '../auth/token-service';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private apiUrl = 'http://localhost:7004/api/v1/systems';
  private readonly DEFAULT_TIMEOUT = 30000;
  private readonly MAX_RETRIES = 1;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  // Get headers with token
  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token && this.tokenService.isTokenValid()) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  createSystem(systemData: SystemModel): Observable<ApiResponse<SystemModel>> {
    return this.http.post<ApiResponse<SystemModel>>(
      `${this.apiUrl}/create`, 
      systemData,
      { headers: this.getHeaders() }
    ).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      retry(this.MAX_RETRIES),
      catchError(this.handleError)
    );
  }

  getAllSystems(includeInactive?: boolean): Observable<ApiResponse<SystemModel[]>> {
    let params = new HttpParams();
    if (includeInactive !== undefined) {
      params = params.set('includeInactive', includeInactive.toString());
    }
    
    return this.http.get<ApiResponse<SystemModel[]>>(
      `${this.apiUrl}/all`, 
      { 
        params,
        headers: this.getHeaders()
      }
    ).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      retry(this.MAX_RETRIES),
      catchError(this.handleError)
    );
  }

  getSystemById(id: number): Observable<ApiResponse<SystemModel>> {
    return this.http.get<ApiResponse<SystemModel>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      retry(this.MAX_RETRIES),
      catchError(this.handleError)
    );
  }

  getSystemsByUserId(userId: number): Observable<ApiResponse<SystemModel[]>> {
    return this.http.get<ApiResponse<SystemModel[]>>(
      `${this.apiUrl}/users/${userId}`,
      { headers: this.getHeaders() }
    ).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      retry(this.MAX_RETRIES),
      catchError(this.handleError)
    );
  }

  updateSystem(id: number, systemData: Partial<SystemModel>): Observable<ApiResponse<SystemModel>> {
    return this.http.put<ApiResponse<SystemModel>>(
      `${this.apiUrl}/${id}`, 
      systemData,
      { headers: this.getHeaders() }
    ).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      retry(this.MAX_RETRIES),
      catchError(this.handleError)
    );
  }

  deleteSystem(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      retry(this.MAX_RETRIES),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to the server. Please check your network connection.';
          break;
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          break;
        case 403:
          errorMessage = 'You don\'t have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = `Server Error (${error.status}): ${error.message}`;
      }
    }
    
    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}