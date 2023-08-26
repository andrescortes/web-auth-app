import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'web-auth-app';

  private authService = inject(AuthService);
  private router = inject(Router);
  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }
    return true;
  });
  public authStatusChangedEffect = effect(() => {
    switch (this.authService.authStatus()) {
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard');
        break;
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login');
        break;
      case AuthStatus.checking: return;
    }
  });
}
