import { Component } from '@angular/core';
import { CompaniesListComponent } from '../companies/companies-list/companies-list.component';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CompaniesListComponent],
  template: `<app-companies-list type="suppliers" />`
})
export class SuppliersComponent {}
