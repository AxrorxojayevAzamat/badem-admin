import { Component } from '@angular/core';
import { CompaniesListComponent } from '../companies/companies-list/companies-list.component';

@Component({
  selector: 'app-stores',
  imports: [CompaniesListComponent],
  template: `<app-companies-list type="stores" />`
})
export class StoresComponent {}
