import { Injectable } from '@angular/core';
import { CompanyService } from './company.service';

@Injectable({ providedIn: 'root' })
export class DistributorsService extends CompanyService {
  protected readonly path = 'distributors';
}
