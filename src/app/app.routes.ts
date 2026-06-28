import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { LayoutComponent } from './features/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProductsListComponent } from './features/products/products-list/products-list.component';
import { DistributorsComponent } from './features/distributors/distributors.component';
import { StoresComponent } from './features/stores/stores.component';
import { SuppliersComponent } from './features/suppliers/suppliers.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'products',
        component: ProductsListComponent,
        canActivate: [roleGuard],
        data: { roles: ['store_operator', 'supplier_operator', 'distributor_operator'] }
      },
      {
        path: 'distributors',
        component: DistributorsComponent,
        canActivate: [roleGuard],
        data: { roles: ['moderator'] }
      },
      {
        path: 'stores',
        component: StoresComponent,
        canActivate: [roleGuard],
        data: { roles: ['moderator'] }
      },
      {
        path: 'suppliers',
        component: SuppliersComponent,
        canActivate: [roleGuard],
        data: { roles: ['moderator'] }
      },
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
