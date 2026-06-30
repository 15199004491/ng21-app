import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfigService } from '@/app/core/config/app.config';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public originalError?: HttpErrorResponse
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private timeoutMs = 2000;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) {}

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private buildUrl(url: string): string {
    const baseUrl = this.appConfig.apiBaseUrl;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${baseUrl}/${url.replace(/^\//, '')}`;
  }

  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return httpParams;
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    let statusCode = error.status;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
      statusCode = 0;
    } else if (error.status === 0) {
      errorMessage = 'Request timed out or network unavailable';
    } else {
      const errorInfo = this.getErrorMessage(error.status);
      errorMessage = errorInfo.message;
      statusCode = errorInfo.code;
      
      this.handleSpecialStatus(error.status);
    }

    console.error(`API Error [${statusCode}]: ${errorMessage}`);
    return throwError(() => new ApiError(statusCode, errorMessage, error));
  }

  private getErrorMessage(status: number): { code: number; message: string } {
    const errorMap: Record<number, string> = {
      304: 'Resource not modified since last request',
      400: 'Bad request - invalid input data',
      401: 'Unauthorized - login required',
      403: 'Forbidden - insufficient permissions',
      404: 'Resource not found',
      408: 'Request timed out',
      409: 'Conflict - resource already exists',
      422: 'Validation error - check input data',
      429: 'Too many requests - please try again later',
      500: 'Internal server error - please try again later',
      502: 'Bad gateway - server unavailable',
      503: 'Service unavailable - please try again later',
      504: 'Gateway timeout - server not responding'
    };

    return {
      code: status,
      message: errorMap[status] || `HTTP error ${status}`
    };
  }

  private handleSpecialStatus(status: number): void {
    switch (status) {
      case 401:
        this.handleUnauthorized();
        break;
      case 403:
        this.handleForbidden();
        break;
      case 429:
        this.handleRateLimit();
        break;
    }
  }

  private handleUnauthorized(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Redirecting to login due to unauthorized access...');
    window.location.href = '/login';
  }

  private handleForbidden(): void {
    console.log('User does not have permission to access this resource');
  }

  private handleRateLimit(): void {
    console.log('Rate limit exceeded - please wait before making more requests');
  }

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<T | null> {
    const fullUrl = this.buildUrl(url);
    const httpParams = this.buildParams(params);

    try {
      let response: ApiResponse<T> | null = null;

      switch (method.toUpperCase()) {
        case 'GET':
          response = await this.http.get<ApiResponse<T>>(fullUrl, { 
            params: httpParams, 
            headers: this.headers 
          }).pipe(
            timeout(this.timeoutMs),
            catchError(this.handleError)
          ).toPromise() || null;
          break;
        case 'POST':
          response = await this.http.post<ApiResponse<T>>(fullUrl, data, { 
            headers: this.headers 
          }).pipe(
            timeout(this.timeoutMs),
            catchError(this.handleError)
          ).toPromise() || null;
          break;
        case 'PUT':
          response = await this.http.put<ApiResponse<T>>(fullUrl, data, { 
            headers: this.headers 
          }).pipe(
            timeout(this.timeoutMs),
            catchError(this.handleError)
          ).toPromise() || null;
          break;
        case 'DELETE':
          response = await this.http.delete<ApiResponse<T>>(fullUrl, { 
            headers: this.headers 
          }).pipe(
            timeout(this.timeoutMs),
            catchError(this.handleError)
          ).toPromise() || null;
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      if (response) {
        if (response.success) {
          return response.data;
        } else {
          console.error(`API Error [${response.code}]: ${response.message}`);
        }
      }
      return null;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error [${error.statusCode}]: ${error.message}`);
      }
      return null;
    }
  }
}

import { inject } from '@angular/core';

const apiService = inject(ApiService);

export const http = {
    request: <T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any, params?: Record<string, any>) => 
        apiService.request<T>(method, url, data, params),
};