import { Component } from '@angular/core';
import { CompaniesListComponent } from '../companies/companies-list/companies-list.component';

@Component({
  selector: 'app-distributors',
  standalone: true,
  imports: [CompaniesListComponent],
  template: `<app-companies-list type="distributors" />`
})
export class DistributorsComponent {}
