import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/authservice.service';
import { ShowAlerts } from 'src/app/services/showAlerts';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private alert: ShowAlerts
  ) {}

  async register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    try {
      const userCredential = await this.authService.register(this.email, this.password);

      this.alert.showAlert('Registro exitoso', 'Ya eres parte de nuestro sistema', () => {
        this.router.navigate(['/login'])
      });
    } catch (error) {

      this.errorMessage = 'Error desconocido al registrar el usuario';
      this.alert.showAlert('Error', this.errorMessage, () => {
      });
    }
  }
}
