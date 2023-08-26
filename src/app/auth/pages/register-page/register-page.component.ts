import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  public myForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  register(): void {
    const { name, email, password } = this.myForm.value;
    if (!name || !email || !password) return;
    this.authService.register(name, email, password)
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (error: string) => {
          Swal.fire('Error', error, 'error');
        },
      });
  }
}
