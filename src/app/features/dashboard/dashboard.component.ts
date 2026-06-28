import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { StoresService } from '../../core/services/stores.service';
import { DistributorsService } from '../../core/services/distributors.service';
import { SuppliersService } from '../../core/services/suppliers.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, Company, Page, ProductState } from '../../core/models';

interface KpiCard {
  label: string;
  value: number | string;
  sub?: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal';
}

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private productsService = inject(ProductsService);
  private storesService = inject(StoresService);
  private distributorsService = inject(DistributorsService);
  private suppliersService = inject(SuppliersService);
  auth = inject(AuthService);

  loading = signal(true);
  error = signal<string | null>(null);

  products = signal<Product[]>([]);
  stores = signal<Company[]>([]);
  distributors = signal<Company[]>([]);
  suppliers = signal<Company[]>([]);

  isAdmin = computed(() => this.auth.hasRole('admin'));
  isModerator = computed(() => this.auth.hasRole('moderator'));

  totalProducts = computed(() => this.products().length);
  totalStock = computed(() => this.products().reduce((sum, p) => sum + p.stock, 0));
  totalValue = computed(() => this.products().reduce((sum, p) => sum + p.price * p.stock, 0));

  productsByState = computed(() => {
    const states: Record<ProductState, number> = {
      at_supplier: 0, at_distributor: 0, at_store: 0, sold: 0, returned: 0,
    };
    for (const p of this.products()) {
      if (p.state) states[p.state]++;
    }
    return states;
  });

  kpiCards = computed<KpiCard[]>(() => {
    const cards: KpiCard[] = [
      { label: 'Total Products', value: this.totalProducts(), sub: `${this.totalStock()} units in stock`, color: 'blue' },
      { label: 'Inventory Value', value: this.totalValue(), sub: 'sum of price × stock', color: 'green' },
      { label: 'Sold', value: this.productsByState().sold, sub: 'products sold', color: 'purple' },
      { label: 'Returned', value: this.productsByState().returned, sub: 'products returned', color: 'red' },
    ];
    if (this.isModerator() || this.isAdmin()) {
      cards.push(
        { label: 'Stores', value: this.stores().length, sub: 'registered stores', color: 'teal' },
        { label: 'Distributors', value: this.distributors().length, sub: 'registered distributors', color: 'orange' },
        { label: 'Suppliers', value: this.suppliers().length, sub: 'registered suppliers', color: 'blue' },
      );
    }
    return cards;
  });

  stateRows = computed(() => {
    const labels: Record<ProductState, string> = {
      at_supplier: 'At Supplier',
      at_distributor: 'At Distributor',
      at_store: 'At Store',
      sold: 'Sold',
      returned: 'Returned',
    };
    const states = this.productsByState();
    const total = this.totalProducts() || 1;
    return (Object.entries(labels) as [ProductState, string][]).map(([key, label]) => ({
      key,
      label,
      count: states[key],
      pct: Math.round((states[key] / total) * 100),
    }));
  });

  ngOnInit() {
    const requests: Record<string, Observable<Page<Product> | Product[] | Company[]>> = {
      products: this.productsService.list(1, 1000),
    };

    if (this.isModerator() || this.isAdmin()) {
      requests['stores'] = this.storesService.list();
      requests['distributors'] = this.distributorsService.list();
      requests['suppliers'] = this.suppliersService.list();
    }

    forkJoin(requests).subscribe({
      next: (res) => {
        const p = res['products'] as Page<Product> | Product[];
        this.products.set(Array.isArray(p) ? p : p.data);
        if (res['stores']) this.stores.set(res['stores'] as Company[]);
        if (res['distributors']) this.distributors.set(res['distributors'] as Company[]);
        if (res['suppliers']) this.suppliers.set(res['suppliers'] as Company[]);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to load dashboard data');
        this.loading.set(false);
      }
    });
  }
}
