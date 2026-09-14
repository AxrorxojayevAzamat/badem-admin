import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  key: 'products' | 'distributors' | 'stores' | 'suppliers';
  path: string;
  label: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { key: 'products', path: '/products', label: 'Products' },
  { key: 'distributors', path: '/distributors', label: 'Distributors' },
  { key: 'stores', path: '/stores', label: 'Stores' },
  { key: 'suppliers', path: '/suppliers', label: 'Suppliers' }
];

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  auth = inject(AuthService);

  user = computed(() => this.auth.currentUser());

  navItems = computed<NavItem[]>(() => {
    if (this.auth.hasRole('admin')) {
      return ALL_NAV_ITEMS;
    }
    const items: NavItem[] = [];
    if (this.auth.hasRole('store_operator', 'supplier_operator', 'distributor_operator')) {
      items.push({ key: 'products', path: '/products', label: 'Products' });
    }
    if (this.auth.hasRole('moderator')) {
      items.push(
        { key: 'distributors', path: '/distributors', label: 'Distributors' },
        { key: 'stores', path: '/stores', label: 'Stores' },
        { key: 'suppliers', path: '/suppliers', label: 'Suppliers' }
      );
    }
    return items;
  });

  logout() {
    this.auth.logout();
  }
}
