import { Injectable } from '@angular/core';
import { CompanyService } from './company.service';

@Injectable({ providedIn: 'root' })
export class SuppliersService extends CompanyService {
  protected readonly path = 'suppliers';
}
