import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/authservice.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuController } from '@ionic/angular'; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, 
    private router: Router,
    private menuCtrl: MenuController) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.router.navigate(['/home']);
        this.menuCtrl.enable(true);
      } else {
        this.router.navigate(['/login']);
        this.menuCtrl.enable(false);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.navigate;  
    this.router.navigate(['/login']);
  }

  navigate() {
    this.menuCtrl.close();  
  }
}
