import { Injectable } from '@angular/core';
import { CompanyService } from './company.service';

@Injectable({ providedIn: 'root' })
export class StoresService extends CompanyService {
  protected readonly path = 'stores';
}
