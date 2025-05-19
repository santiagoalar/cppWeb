import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from 'src/app/models/order-data.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = `${environment.apiBaseUrl}/bff/v1/web/orders`;

  constructor(private http: HttpClient) {}

  private getAuthHeader(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, this.getAuthHeader()).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getOrderDetail(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`, this.getAuthHeader()).pipe(
      catchError(error => throwError(() => error))
    );
  }
}