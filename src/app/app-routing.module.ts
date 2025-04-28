import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { MainPageComponent } from './basic/main-page/main-page.component';
import { AuthGuard } from './auth/auth.guard';
import { SharedLayoutComponent } from './shared/components/shared-layout/shared-layout.component';
import { ManufacturersComponent } from './modules/manufacturers/manufacturers.component';
import { ProductsComponent } from './modules/products/products.component';

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