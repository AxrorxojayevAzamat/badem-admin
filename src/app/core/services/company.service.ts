import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Company } from '../models';

export abstract class CompanyService {
  protected api = inject(ApiService);
  protected abstract readonly path: string;

  list(): Observable<Company[]> {
    return this.api.get<Company[] | { data: Company[] }>(`/${this.path}`).pipe(
      map((res) => (Array.isArray(res) ? res : res.data ?? []))
    );
  }

  create(body: unknown): Observable<Company> {
    return this.api.post<Company>(`/${this.path}`, body);
  }

  update(id: string, body: unknown): Observable<Company> {
    return this.api.patch<Company>(`/${this.path}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/${this.path}/${id}`);
  }
}
