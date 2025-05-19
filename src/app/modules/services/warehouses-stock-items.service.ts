import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WarehouseStockItemData } from 'src/app/models/warehouse-stock-items-data.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseStockItemsService {
  private apiUrl = `${environment.apiBaseUrl}/bff/v1/web/warehouse-stock-items`;

  constructor(private http: HttpClient) { }
  
  private getAuthHeader(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
  
  createStockItem(stockItem: WarehouseStockItemData): Observable<WarehouseStockItemData> {
    return this.http.post<WarehouseStockItemData>(this.apiUrl, stockItem, this.getAuthHeader());
  }
  
  getStockItemById(id: string): Observable<WarehouseStockItemData> {
    return this.http.get<WarehouseStockItemData>(`${this.apiUrl}/${id}`, this.getAuthHeader());
  }
  
  getStockItemsByWarehouseId(warehouseId: string): Observable<WarehouseStockItemData[]> {
    return this.http.get<WarehouseStockItemData[]>(
      `${this.apiUrl}/warehouse/${warehouseId}`, 
      this.getAuthHeader()
    );
  }
  
  updateStockItem(id: string, stockItem: WarehouseStockItemData): Observable<WarehouseStockItemData> {
    return this.http.put<WarehouseStockItemData>(`${this.apiUrl}/${id}`, stockItem, this.getAuthHeader());
  }
  
  deleteStockItem(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeader());
  }
}