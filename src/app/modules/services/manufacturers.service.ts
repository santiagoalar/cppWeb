import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManufacturerData } from 'src/app/models/manufacturer-data.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
    private apiUrl = `${environment.apiBaseUrl}/bff/v1/web/manufacturers`;

  constructor(private http: HttpClient) {}

  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  createManufacturer(manufacturer: ManufacturerData): Observable<ManufacturerData> { 
    return this.http.post<ManufacturerData>(`${this.apiUrl}`, manufacturer, this.getAuthHeader());
  }

  getAllManufacturers(nit?: string): Observable<ManufacturerData[]> {
    if (nit) {
      return this.http.get<ManufacturerData[]>(`${this.apiUrl}/search?nit=${nit}`, this.getAuthHeader());
    }
    return this.http.get<ManufacturerData[]>(`${this.apiUrl}`, this.getAuthHeader());
  }

  getManufacturerById(id: string): Observable<ManufacturerData> {
    return this.http.get<ManufacturerData>(`${this.apiUrl}/${id}`, this.getAuthHeader());
  }

  updateManufacturer(id: string, manufacturer: ManufacturerData): Observable<ManufacturerData> {
    return this.http.put<ManufacturerData>(`${this.apiUrl}/${id}`, manufacturer, this.getAuthHeader());
  }

  getManufacturerByNit(nit: string): Observable<ManufacturerData> {
    return this.http.get<ManufacturerData>(`${this.apiUrl}/search?nit=${nit}`, this.getAuthHeader());
  }

  deleteManufacturer(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeader());
  }
}