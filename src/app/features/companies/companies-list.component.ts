import { Component, inject, signal, input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Company } from '../../core/models';

type CompanyType = 'stores' | 'distributors' | 'suppliers';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [ReactiveFormsModule],
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
  formLoading = signal(false);
  formError = signal<string | null>(null);

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl(''),
    phone: new FormControl('')
  });

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
    this.form.reset();
    this.formError.set(null);
    this.showForm.set(true);
  }

  openEdit(company: Company) {
    this.editingCompany.set(company);
    this.form.patchValue({ name: company.name, address: company.address ?? '', phone: company.phone ?? '' });
    this.formError.set(null);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingCompany.set(null);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formLoading.set(true);
    this.formError.set(null);
    const body = this.form.value;
    const editing = this.editingCompany();
    const req = editing
      ? this.api.patch(`/${this.type()}/${editing.id}`, body)
      : this.api.post(`/${this.type()}`, body);

    req.subscribe({
      next: () => {
        this.formLoading.set(false);
        this.closeForm();
        this.load();
      },
      error: (err) => {
        this.formLoading.set(false);
        this.formError.set(err?.error?.message ?? 'Failed to save');
      }
    });
  }

  delete(company: Company) {
    if (!confirm(`Delete "${company.name}"?`)) return;
    this.api.delete(`/${this.type()}/${company.id}`).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err?.error?.message ?? 'Failed to delete')
    });
  }
}
