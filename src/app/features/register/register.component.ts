import { Component, inject, signal } from '@angular/core';
import { form, schema, required, email, minLength, FormRoot, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models';

interface RegisterModel {
  email: string;
  password: string;
  role: Role | '';
}

const ROLE_OPTIONS: { label: string; value: Role }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Moderator', value: 'moderator' },
  { label: 'Store Operator', value: 'store_operator' },
  { label: 'Supplier Operator', value: 'supplier_operator' },
  { label: 'Distributor Operator', value: 'distributor_operator' },
];

@Component({
  selector: 'app-register',
  imports: [FormRoot, FormField, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly roleOptions = ROLE_OPTIONS;

  error = signal<string | null>(null);
  loading = signal(false);

  private model = signal<RegisterModel>({ email: '', password: '', role: '' });

  fields = form(this.model, schema<RegisterModel>(({ email: emailPath, password, role }) => {
    required(emailPath);
    email(emailPath);
    required(password);
    minLength(password, 6);
    required(role);
  }));

  submit() {
    if (!this.fields().valid()) {
      this.fields().markAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const { email: emailVal, password, role } = this.model();
    this.auth.register(emailVal, password, role as Role).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Registration failed. Please try again.');
      }
    });
  }
}
