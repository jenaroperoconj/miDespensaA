import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/authservice.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  email: string = '';
  displayName: string = 'Usuario';
  errorMessage: string = '';
  photoURL: string = '';

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getCurrentUser();
      if (user) {
        this.email = user.email || '';
        this.displayName = user.displayName || 'Usuario';
        this.photoURL = user.photoURL || 'https://www.gravatar.com/avatar/placeholder';
      } else {
        this.errorMessage = 'No hay usuario autenticado';
      }
    } catch (error) {
      this.errorMessage = 'Error al obtener los datos del usuario';
    }
  }
}
