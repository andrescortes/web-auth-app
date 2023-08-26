import { AuthService } from './../../../auth/services/auth.service';
import { Component, computed, inject } from '@angular/core';

@Component({
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {
  private readonly authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());

  onLogout(): void {
    this.authService.logout();
  }
}
