import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SellingPlanData } from 'src/app/models/selling-plans-data.model';

@Injectable({
  providedIn: 'root'
})
export class SellingPlansService {
  private apiUrl = `${environment.apiBaseUrl}/bff/v1/web/selling-plans`;

  constructor(private http: HttpClient) { }
  
  private getAuthHeader(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
  
  createSellingPlan(plan: SellingPlanData): Observable<SellingPlanData> {
    return this.http.post<SellingPlanData>(this.apiUrl, plan, this.getAuthHeader());
  }
  
  getSellingPlanById(id: string): Observable<SellingPlanData> {
    return this.http.get<SellingPlanData>(`${this.apiUrl}/${id}`, this.getAuthHeader());
  }
  
  getUserSellingPlans(userId: string): Observable<SellingPlanData[]> {
    return this.http.get<SellingPlanData[]>(`${this.apiUrl}/user/${userId}`, this.getAuthHeader());
  }
  
  updateSellingPlan(id: string, plan: SellingPlanData): Observable<SellingPlanData> {
    return this.http.put<SellingPlanData>(`${this.apiUrl}/${id}`, plan, this.getAuthHeader());
  }
  
  deleteSellingPlan(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeader());
  }
}