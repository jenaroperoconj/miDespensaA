import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/authservice.service';
import { ShowAlerts } from '../services/showAlerts'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private showAlerts: ShowAlerts
  ) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      (userCredential) => {
        this.router.navigate(['/home']);
      },
      (error) => {
        this.showAlerts.showAlert('Error', error, () => {
          this.errorMessage = error;
        });
      }
    );
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }
}
