import { Component } from '@angular/core';
import { CompaniesListComponent } from '../companies/companies-list/companies-list.component';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [CompaniesListComponent],
  template: `<app-companies-list type="stores" />`
})
export class StoresComponent {}
