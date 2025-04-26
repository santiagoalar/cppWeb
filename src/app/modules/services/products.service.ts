import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductData } from 'src/app/models/product-data.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiBaseUrl}/bff/v1/web/products/`;

  constructor(private http: HttpClient) {}

  createProduct(product: ProductData): Observable<ProductData> {
    return this.http.post<ProductData>(`${this.apiUrl}`, product);
  }

  getAllProducts(): Observable<ProductData[]> {
    return this.http.get<ProductData[]>(`${this.apiUrl}`);
  }

  getProductById(id: string): Observable<ProductData> {
    return this.http.get<ProductData>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: string, product: ProductData): Observable<ProductData> {
    return this.http.put<ProductData>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}