import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

import { GoogleMapsService } from '../services/google-maps.service';
import { ShowAlerts } from '../services/showAlerts';

@Component({
  selector: 'app-tiendas-cercanas',
  templateUrl: './tiendas-cercanas.page.html',
  styleUrls: ['./tiendas-cercanas.page.scss'],
})
export class TiendasCercanasPage implements OnInit {
  mapElement: HTMLElement | undefined;

  constructor(
    private googleMapsService: GoogleMapsService,
    private showAlerts: ShowAlerts
  ) {}

  ngOnInit() {
    this.getLocation();
  }

  async getLocation() {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
      this.initializeMap(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      this.showAlerts.showAlert(
        'Error',
        'No se pudo obtener tu ubicación. Asegúrate de tener habilitados los permisos de ubicación.',
        () => {}
      );
    }
  }

  initializeMap(lat: number, lng: number) {
    this.mapElement = document.getElementById('map') as HTMLElement;
  
    if (this.mapElement) {
      this.googleMapsService.loadGoogleMaps('AIzaSyDraesw0vs_RjCV79vIgr8guxlIogYQKGQ').then(() => {
        this.googleMapsService.initMap(this.mapElement!, lat, lng);
      }).catch((error) => {
        this.showAlerts.showAlert(
          'Error',
          'No se pudo cargar el mapa. Por favor, intenta más tarde.',
          () => {}
        );
      });
    } else {
      this.showAlerts.showAlert(
        'Error',
        'No se pudo encontrar el contenedor del mapa.',
        () => {}
      );
    }
  }
}
