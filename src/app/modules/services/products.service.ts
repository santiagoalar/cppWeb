import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductData } from 'src/app/models/product-data.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiBaseUrl}/bff/v1/web/products/`;

  constructor(private http: HttpClient) { }

  private getAuthHeader(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  createProduct(product: ProductData): Observable<ProductData> {
    return this.http.post<ProductData>(`${this.apiUrl}`, product, this.getAuthHeader());
  }

  getAllProducts(): Observable<ProductData[]> {
    return this.http.get<ProductData[]>(`${this.apiUrl}`, this.getAuthHeader());
  }

  getProductById(id: string): Observable<ProductData> {
    return this.http.get<ProductData>(`${this.apiUrl}${id}`, this.getAuthHeader());
  }

  updateProduct(id: string, product: ProductData): Observable<ProductData> {
    return this.http.put<ProductData>(`${this.apiUrl}${id}`, product, this.getAuthHeader());
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}`, this.getAuthHeader());
  }

  uploadProductsBulk(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<any>(
      `${this.apiUrl}bulk`, formData, this.getAuthHeader()
    );
  }
}