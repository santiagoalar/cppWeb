import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { MainPageComponent } from './basic/main-page/main-page.component';
import { AuthGuard } from './auth/auth.guard';
import { SharedLayoutComponent } from './shared/components/shared-layout/shared-layout.component';
import { ManufacturersComponent } from './modules/manufacturers/manufacturers.component';
import { ProductsComponent } from './modules/products/products.component';
import { OrdersComponent } from './modules/orders/orders.component';
import { SellingPlansComponent } from './modules/selling-plans/selling-plans.component';
import { RoutesComponent } from './modules/routes/routes.component';
import { WarehousesComponent } from './modules/warehouses/warehouses.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  {
    path: '',
    component: SharedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'main-page', component: MainPageComponent },
      { path: 'manufacturers', component: ManufacturersComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'routes', component: RoutesComponent },
      { path: 'selling-plans', component: SellingPlansComponent },
      { path: 'warehouse', component: WarehousesComponent },
      { path: '', redirectTo: 'main-page', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/sign-in' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }