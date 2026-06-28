import { Component, ChangeDetectionStrategy, inject, input, output, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CompanyService } from '../../../core/services/company.service';
import { StoresService } from '../../../core/services/stores.service';
import { DistributorsService } from '../../../core/services/distributors.service';
import { SuppliersService } from '../../../core/services/suppliers.service';
import { Company } from '../../../core/models';
import { ModalComponent } from '../../../shared/modal/modal.component';

type CompanyType = 'stores' | 'distributors' | 'suppliers';

@Component({
  selector: 'app-company-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss'
})
export class CompanyFormComponent {
  private stores = inject(StoresService);
  private distributors = inject(DistributorsService);
  private suppliers = inject(SuppliersService);

  type = input.required<CompanyType>();
  label = input.required<string>();
  company = input<Company | null>(null);

  private get service(): CompanyService {
    const services: Record<CompanyType, CompanyService> = {
      stores: this.stores,
      distributors: this.distributors,
      suppliers: this.suppliers
    };
    return services[this.type()];
  }

  saved = output<void>();
  cancelled = output<void>();

  loading = signal(false);
  error = signal<string | null>(null);

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl(''),
    phone: new FormControl('')
  });

  constructor() {
    effect(() => {
      const c = this.company();
      this.error.set(null);
      if (c) {
        this.form.patchValue({ name: c.name, address: c.address ?? '', phone: c.phone ?? '' });
      } else {
        this.form.reset();
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const body = this.form.value;
    const editing = this.company();
    const req = editing
      ? this.service.update(editing.id, body)
      : this.service.create(body);

    req.subscribe({
      next: () => {
        this.loading.set(false);
        this.saved.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to save');
      }
    });
  }
}
