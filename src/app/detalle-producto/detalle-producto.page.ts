import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { FirestoreService } from '../services/firestore.service';
import { ShowAlerts } from '../services/showAlerts';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage implements OnInit {
  productForm!: FormGroup;
  productId!: string;
  productImage: string | null = null;
  minDate: string = new Date().toISOString();

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private showAlerts: ShowAlerts
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id')!;

    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      marca: [''],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      fechaVencimiento: ['', Validators.required],
      categoria: [''],
      sku: [''],
    });

    this.loadProductDetails();
  }

  loadProductDetails() {
    this.firestoreService.getProductById(this.productId).subscribe(
      (product) => {
        if (product) {
          const fechaVencimiento = product.fechaVencimiento
            ? (typeof product.fechaVencimiento.toDate === 'function'
                ? product.fechaVencimiento.toDate().toISOString()
                : product.fechaVencimiento)
            : '';

          this.productForm.patchValue({
            nombre: product.nombre || '',
            marca: product.marca || '',
            cantidad: product.cantidad || '',
            fechaVencimiento: fechaVencimiento,
            categoria: product.categoria || '',
            sku: product.sku || '',
          });

          this.productImage = product.imagen || null;
        }
      },
      (error) => {
        console.error("Error loading product details: ", error);
        this.showAlerts.showAlert(
          'Error',
          'Hubo un error al cargar los detalles del producto. Por favor, inténtalo nuevamente.'
        );
      }
    );
  }

  guardarCambios() {
    if (this.productForm.valid) {
      const updatedData = this.productForm.value;

      if (updatedData.fechaVencimiento && typeof updatedData.fechaVencimiento === 'string') {
        updatedData.fechaVencimiento = new Date(updatedData.fechaVencimiento);
      }

      this.firestoreService
        .updateProduct(this.productId, updatedData)
        .then(() => {
          this.router.navigate(['/mis-productos']);
        })
        .catch((error) => {
          console.error("Error updating product: ", error);
          this.showAlerts.showAlert(
            'Error',
            'No se pudo guardar los cambios. Por favor, intenta nuevamente.'
          );
        });
    }
  }

  eliminarProducto() {
    this.showAlerts.showAlert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este producto?',
      () => {
        this.firestoreService.deleteProduct(this.productId).then(() => {
          this.router.navigate(['/mis-productos']);
        }).catch((error) => {
          console.error("Error deleting product: ", error);
          this.showAlerts.showAlert(
            'Error',
            'No se pudo eliminar el producto. Por favor, intenta nuevamente.'
          );
        });
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
