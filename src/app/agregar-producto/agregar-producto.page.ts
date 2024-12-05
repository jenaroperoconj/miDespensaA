import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';

import { FirestoreService } from '../services/firestore.service';
import { ShowAlerts } from 'src/app/services/showAlerts';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.page.html',
  styleUrls: ['./agregar-producto.page.scss'],
})
export class AgregarProductoPage implements OnInit {
  productForm!: FormGroup;
  minDate!: string;
  capturedImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private location: Location,
    private router: Router,
    private alert: ShowAlerts
  ) {}

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString();

    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      marca: [''],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      fechaVencimiento: ['', Validators.required],
      categoria: [''],
      sku: ['']
    });
  }

  async openCamera() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      this.capturedImage = image?.dataUrl || null;
    } catch (error) {
      this.capturedImage = null;
    }
  }

  agregarProducto() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      const capturedImage = this.capturedImage;

      this.firestoreService.addProduct(productData, capturedImage).then(() => {
        this.alert.showAlert('Producto Agregado', 'Se ha agregado un producto', () => {
          this.router.navigate(['/mis-productos']);
        });
      }).catch((error) => {
        this.alert.showAlert('Error', 'No se pudo agregar el producto', () => {
          console.error(error);
        });
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
