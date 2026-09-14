import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink],
  template: `
    <section class="unauthorized" role="alert">
      <h1>Access denied</h1>
      <p>
        You don't have permission to view this page.
        @if (role(); as currentRole) {
          Your account is signed in as <strong>{{ currentRole }}</strong>.
        }
      </p>
      <div class="actions">
        <a class="btn-primary" routerLink="/dashboard">Back to dashboard</a>
        <button type="button" class="btn-secondary" (click)="logout()">Sign in as another user</button>
      </div>
    </section>
  `,
  styles: `
    .unauthorized {
      max-width: 32rem;
      margin: 4rem auto;
      padding: 2rem;
      text-align: center;
    }

    h1 {
      margin: 0 0 0.75rem;
      font-size: 1.5rem;
      color: #1f2937;
    }

    p {
      margin: 0 0 1.5rem;
      color: #4b5563;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.6rem 1.1rem;
      border-radius: 6px;
      font: inherit;
      cursor: pointer;
      text-decoration: none;
    }

    .btn-primary {
      background: #1d4ed8;
      color: #fff;
      border: 1px solid #1d4ed8;
    }

    .btn-secondary {
      background: #fff;
      color: #1f2937;
      border: 1px solid #d1d5db;
    }

    .btn-primary:focus-visible,
    .btn-secondary:focus-visible {
      outline: 2px solid #1d4ed8;
      outline-offset: 2px;
    }
  `
})
export class UnauthorizedComponent {
  private auth = inject(AuthService);

  role = computed(() => this.auth.currentUser()?.role ?? null);

  logout() {
    this.auth.logout();
  }
}
