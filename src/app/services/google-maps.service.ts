import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  constructor() {}


  loadGoogleMaps(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined') {
        resolve(); 
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject('No se pudo cargar Google Maps');
        document.body.appendChild(script);
      }
    });
  }


  initMap(mapElement: HTMLElement, lat: number, lng: number): void {
    const map = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: 15,
    });

    new google.maps.Marker({
      position: { lat, lng },
      map: map,
    });
  }
}
