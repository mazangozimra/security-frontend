// role.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { RoleModel } from '../model/role-model';
import { ApiResponse } from '../model/api-response';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:7004/api/v1/role';

  private readonly DEFAULT_TIMEOUT = 30000;
  private readonly MAX_RETRIES = 1;

  constructor(private http: HttpClient) { }

  createRole(roleData: RoleModel): Observable<ApiResponse<RoleModel>> {
    return this.http.post<ApiResponse<RoleModel>>(`${this.apiUrl}/create`, roleData)
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError)
      );
  }

  getRoleById(id: number): Observable<ApiResponse<RoleModel>> {
    return this.http.get<ApiResponse<RoleModel>>(`${this.apiUrl}/${id}`)
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError)
      );
  }

  getRoleBySystemId(systemId: number): Observable<ApiResponse<RoleModel>> {
    return this.http.get<ApiResponse<RoleModel>>(`${this.apiUrl}/get-by-system/${systemId}`)
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry(this.MAX_RETRIES),
        catchError(this.handleError)
      );
  }

  deleteRole(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete/${id}`)
      .pipe(
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
          errorMessage = 'The requested role was not found.';
          break;
        case 409:
          errorMessage = 'Role conflict. The role may already exist.';
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