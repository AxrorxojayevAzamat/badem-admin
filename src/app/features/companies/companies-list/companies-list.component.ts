import { Component, ChangeDetectionStrategy, inject, signal, input, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Company } from '../../../core/models';
import { CompanyFormComponent } from '../company-form/company-form.component';

type CompanyType = 'stores' | 'distributors' | 'suppliers';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CompanyFormComponent],
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.scss'
})
export class CompaniesListComponent implements OnInit {
  private api = inject(ApiService);

  type = input.required<CompanyType>();

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
    this.api.get<Company[] | any>(`/${this.type()}`).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.companies.set(Array.isArray(res) ? res : (res.data ?? []));
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
    this.api.delete(`/${this.type()}/${company.id}`).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err?.error?.message ?? 'Failed to delete')
    });
  }
}
