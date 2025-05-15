import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Order } from 'src/app/models/order-data.model';
import { OrdersService } from '../services/orders.service';
import { OrderDetailsModalComponent } from './order-details-modal/order-details-modal.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class OrdersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'date', 'status', 'transactionStatus', 'clientId', 'total', 'actions'];
  orders = new MatTableDataSource<Order>([]);
  loading = true;
  searchClient = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.orders.paginator = this.paginator;
  }

  loadOrders(): void {
    this.loading = true;
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        this.orders.data = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders', error);
        this.loading = false;
      }
    });
  }

  viewOrderDetails(orderId: string): void {
    this.loading = true;
    this.ordersService.getOrderDetail(orderId).subscribe({
      next: (orderDetail) => {
        this.loading = false;
        this.dialog.open(OrderDetailsModalComponent, {
          width: '800px',
          data: orderDetail
        });
      },
      error: (error) => {
        console.error('Error loading order details', error);
        this.loading = false;
      }
    });
  }
}