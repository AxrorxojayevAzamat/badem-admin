import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  private api = inject(ApiService);

  users = signal<User[]>([]);
  loading = signal(true);
  noApi = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.api.get<User[] | any>('/users').subscribe({
      next: (res) => {
        this.loading.set(false);
        if (Array.isArray(res)) {
          this.users.set(res);
        } else if (res?.data && Array.isArray(res.data)) {
          this.users.set(res.data);
        } else {
          this.noApi.set(true);
        }
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404 || err.status === 501) {
          this.noApi.set(true);
        } else {
          this.error.set(err?.error?.message ?? 'Failed to load users');
        }
      }
    });
  }
}
