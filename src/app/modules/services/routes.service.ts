import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RouteData } from 'src/app/models/routes-data.model';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  private apiUrl = `${environment.apiBaseUrl}/bff/v1/web/routes`;

  constructor(private http: HttpClient) { }
  
  private getAuthHeader(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
  
  createRoute(route: RouteData): Observable<RouteData> {
    return this.http.post<RouteData>(this.apiUrl, route, this.getAuthHeader());
  }
  
  getRouteById(id: string): Observable<RouteData> {
    return this.http.get<RouteData>(`${this.apiUrl}/${id}`, this.getAuthHeader());
  }
  
  getUserRoutes(userId: string): Observable<RouteData[]> {
    return this.http.get<RouteData[]>(`${this.apiUrl}/users/${userId}`, this.getAuthHeader());
  }
  
  updateRoute(id: string, route: RouteData): Observable<RouteData> {
    return this.http.put<RouteData>(`${this.apiUrl}/${id}`, route, this.getAuthHeader());
  }
  
  deleteRoute(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeader());
  }
}