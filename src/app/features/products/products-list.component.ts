import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, Page } from '../../core/models';
import { ProductFormComponent } from './product-form.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [ProductFormComponent, DecimalPipe],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);

  products = signal<Product[]>([]);
  total = signal(0);
  page = signal(1);
  limit = signal(10);
  loading = signal(true);
  error = signal<string | null>(null);

  showForm = signal(false);
  editingProduct = signal<Product | null>(null);

  workflowLoading = signal<string | null>(null);
  workflowError = signal<string | null>(null);
  workflowInput = signal<{ productId: string; field: string } | null>(null);
  workflowInputValue = signal('');

  totalPages = computed(() => Math.ceil(this.total() / this.limit()));

  isSupplier = computed(() => this.auth.hasRole('supplier_operator'));
  isDistributor = computed(() => this.auth.hasRole('distributor_operator'));
  isStore = computed(() => this.auth.hasRole('store_operator'));

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Page<Product> | Product[]>('/products', { page: this.page(), limit: this.limit() }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (Array.isArray(res)) {
          this.products.set(res);
          this.total.set(res.length);
        } else {
          this.products.set(res.data);
          this.total.set(res.total);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to load products');
      }
    });
  }

  openCreate() {
    this.editingProduct.set(null);
    this.showForm.set(true);
  }

  openEdit(product: Product) {
    this.editingProduct.set(product);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingProduct.set(null);
  }

  onSaved() {
    this.closeForm();
    this.loadProducts();
  }

  delete(product: Product) {
    if (!confirm(`Delete "${product.name}"?`)) return;
    this.api.delete(`/products/${product.id}`).subscribe({
      next: () => this.loadProducts(),
      error: (err) => this.error.set(err?.error?.message ?? 'Failed to delete')
    });
  }

  doAction(path: string, body: unknown = {}) {
    this.workflowLoading.set(path);
    this.workflowError.set(null);
    this.api.patch(path, body).subscribe({
      next: () => {
        this.workflowLoading.set(null);
        this.loadProducts();
      },
      error: (err) => {
        this.workflowLoading.set(null);
        this.workflowError.set(err?.error?.message ?? 'Action failed');
      }
    });
  }

  promptInput(productId: string, field: string) {
    this.workflowInput.set({ productId, field });
    this.workflowInputValue.set('');
  }

  confirmInput() {
    const wi = this.workflowInput();
    if (!wi) return;
    const val = this.workflowInputValue().trim();
    if (!val) return;
    const body: Record<string, string> = { [wi.field]: val };
    this.doAction(`/products/${wi.productId}/${this.actionPathForField(wi.field)}`, body);
    this.workflowInput.set(null);
  }

  cancelInput() {
    this.workflowInput.set(null);
  }

  private actionPathForField(field: string): string {
    const map: Record<string, string> = {
      supplierId: 'assign-supplier',
      distributorId: 'give-to-distributor',
      storeId: 'accept-at-store',
      reason: 'return-to-distributor'
    };
    return map[field] ?? field;
  }

  goPage(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadProducts();
  }

  stateClass(state?: string): string {
    const map: Record<string, string> = {
      at_supplier: 'state-supplier',
      at_distributor: 'state-distributor',
      at_store: 'state-store',
      sold: 'state-sold',
      returned: 'state-returned'
    };
    return map[state ?? ''] ?? '';
  }
}
