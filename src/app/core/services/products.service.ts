import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product, Page } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private api = inject(ApiService);

  list(page: number, limit: number): Observable<Page<Product> | Product[]> {
    return this.api.get<Page<Product> | Product[]>('/products', { page, limit });
  }

  create(body: unknown): Observable<Product> {
    return this.api.post<Product>('/products', body);
  }

  update(id: string, body: unknown): Observable<Product> {
    return this.api.patch<Product>(`/products/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/products/${id}`);
  }

  assignSupplier(id: string, supplierId: string): Observable<Product> {
    return this.api.patch<Product>(`/products/${id}/assign-supplier`, { supplierId });
  }

  giveToDistributor(id: string, distributorId: string): Observable<Product> {
    return this.api.patch<Product>(`/products/${id}/give-to-distributor`, { distributorId });
  }

  acceptAtStore(id: string, storeId: string): Observable<Product> {
    return this.api.patch<Product>(`/products/${id}/accept-at-store`, { storeId });
  }

  returnToDistributor(id: string, reason: string): Observable<Product> {
    return this.api.patch<Product>(`/products/${id}/return-to-distributor`, { reason });
  }

  returnToSupplier(id: string): Observable<Product> {
    return this.api.patch<Product>(`/products/${id}/return-to-supplier`, {});
  }

  acceptReturn(id: string): Observable<Product> {
    return this.api.patch<Product>(`/products/${id}/accept-return`, {});
  }

  markSold(id: string): Observable<Product> {
    return this.api.patch<Product>(`/products/${id}/mark-sold`, {});
  }
}
