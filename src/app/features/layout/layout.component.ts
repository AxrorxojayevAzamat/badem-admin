import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  auth = inject(AuthService);

  user = computed(() => this.auth.currentUser());

  showUsers = computed(() => this.auth.hasRole('admin'));
  showProducts = computed(() => this.auth.hasRole('store_operator', 'supplier_operator', 'distributor_operator'));
  showDistributors = computed(() => this.auth.hasRole('moderator'));
  showStores = computed(() => this.auth.hasRole('moderator'));
  showSuppliers = computed(() => this.auth.hasRole('moderator'));

  logout() {
    this.auth.logout();
  }
}
