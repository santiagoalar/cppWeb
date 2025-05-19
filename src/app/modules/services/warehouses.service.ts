import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WarehouseData } from 'src/app/models/warehouse-data.model';

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {
  private apiUrl = `${environment.apiBaseUrl}/bff/v1/web/warehouses`;

  constructor(private http: HttpClient) { }
  
  private getAuthHeader(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
  
  createWarehouse(warehouse: WarehouseData): Observable<WarehouseData> {
    return this.http.post<WarehouseData>(this.apiUrl, warehouse, this.getAuthHeader());
  }
  
  getWarehouseById(id: string): Observable<WarehouseData> {
    return this.http.get<WarehouseData>(`${this.apiUrl}/${id}`, this.getAuthHeader());
  }
  
  getWarehousesByAdministratorId(administratorId: string): Observable<WarehouseData[]> {
    const params = new HttpParams().set('administrator_id', administratorId);
    return this.http.get<WarehouseData[]>(this.apiUrl, {
      ...this.getAuthHeader(),
      params
    });
  }
  
  getAllWarehouses(): Observable<WarehouseData[]> {
    return this.http.get<WarehouseData[]>(this.apiUrl, this.getAuthHeader());
  }
  
  updateWarehouse(id: string, warehouse: WarehouseData): Observable<WarehouseData> {
    return this.http.put<WarehouseData>(`${this.apiUrl}/${id}`, warehouse, this.getAuthHeader());
  }
  
  deleteWarehouse(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeader());
  }
}