import { Component, inject, signal, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private api = inject(ApiService);

  product = input<Product | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  loading = signal(false);
  error = signal<string | null>(null);

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    sku: new FormControl('', [Validators.required]),
    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)])
  });

  ngOnInit() {
    const p = this.product();
    if (p) {
      this.form.patchValue({
        name: p.name,
        description: p.description ?? '',
        price: p.price,
        sku: p.sku,
        stock: p.stock
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const body = this.form.value;
    const p = this.product();
    const req = p
      ? this.api.patch(`/products/${p.id}`, body)
      : this.api.post('/products', body);

    req.subscribe({
      next: () => {
        this.loading.set(false);
        this.saved.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to save product');
      }
    });
  }

  cancel() {
    this.cancelled.emit();
  }
}
