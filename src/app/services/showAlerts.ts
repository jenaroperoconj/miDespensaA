import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root', 
})

export class ShowAlerts {

  constructor(private alertController: AlertController) {}

  async showAlert(
    header: string, 
    message: string, 
    onConfirm: () => void = () => {},
    onCancel?: () => void
  ) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            onConfirm();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            if (onCancel) {
              onCancel();
            }
          }
        }
      ]
    });
  
    await alert.present(); 
  }

  
  
}