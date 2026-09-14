import { Component, inject, signal, input, OnInit } from '@angular/core';
import { CompanyService } from '../../../core/services/company.service';
import { StoresService } from '../../../core/services/stores.service';
import { DistributorsService } from '../../../core/services/distributors.service';
import { SuppliersService } from '../../../core/services/suppliers.service';
import { Company } from '../../../core/models';
import { CompanyFormComponent } from '../company-form/company-form.component';

type CompanyType = 'stores' | 'distributors' | 'suppliers';

@Component({
  selector: 'app-companies-list',
  imports: [CompanyFormComponent],
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.scss'
})
export class CompaniesListComponent implements OnInit {
  private stores = inject(StoresService);
  private distributors = inject(DistributorsService);
  private suppliers = inject(SuppliersService);

  type = input.required<CompanyType>();

  private get service(): CompanyService {
    const services: Record<CompanyType, CompanyService> = {
      stores: this.stores,
      distributors: this.distributors,
      suppliers: this.suppliers
    };
    return services[this.type()];
  }

  companies = signal<Company[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  showForm = signal(false);
  editingCompany = signal<Company | null>(null);

  get label(): string {
    return this.type().replace(/s$/, '');
  }

  get title(): string {
    return this.type().charAt(0).toUpperCase() + this.type().slice(1);
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.service.list().subscribe({
      next: (companies) => {
        this.loading.set(false);
        this.companies.set(companies);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? `Failed to load ${this.type()}`);
      }
    });
  }

  openCreate() {
    this.editingCompany.set(null);
    this.showForm.set(true);
  }

  openEdit(company: Company) {
    this.editingCompany.set(company);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingCompany.set(null);
  }

  onSaved() {
    this.closeForm();
    this.load();
  }

  delete(company: Company) {
    if (!confirm(`Delete "${company.name}"?`)) return;
    this.service.delete(company.id).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err?.error?.message ?? 'Failed to delete')
    });
  }
}
