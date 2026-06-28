import { Component, inject, signal } from '@angular/core';
import { form, schema, required, email, minLength, FormRoot, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormRoot, FormField, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal<string | null>(null);
  loading = signal(false);

  private model = signal<LoginModel>({ email: '', password: '' });

  fields = form(
    this.model,
    schema<LoginModel>(({ email: emailPath, password }) => {
      required(emailPath);
      email(emailPath);
      required(password);
      minLength(password, 6);
    }));

  submit() {
    if (!this.fields().valid()) {
      this.fields().markAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const { email: emailVal, password } = this.model();
    this.auth.login(emailVal, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Login failed. Please check your credentials.');
      }
    });
  }
}
