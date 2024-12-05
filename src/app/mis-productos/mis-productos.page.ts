import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { FirestoreService } from '../services/firestore.service'; 
import { ShowAlerts } from 'src/app/services/showAlerts';

@Component({
  selector: 'app-mis-productos',
  templateUrl: './mis-productos.page.html',
  styleUrls: ['./mis-productos.page.scss'],
})
export class MisProductosPage implements OnInit {
  productos: any[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private location: Location,
    private alert: ShowAlerts
  ) { }

  ngOnInit() {

    this.firestoreService.getProducts().subscribe(
      (productos) => {
        this.productos = productos;
      },
      (error) => {
        this.alert.showAlert('Error', 'Hubo un problema al cargar los productos');
      }
    );
  }


  viewProductDetail(productId: string) {
    this.router.navigate([`/detalle-producto/${productId}`]);
  }


  delProduct(producto: any) {
    this.firestoreService.deleteProduct(producto.id).then(() => {
      this.alert.showAlert('Producto Eliminado', 'Se ha eliminado el producto');
    }).catch((error) => {
      this.alert.showAlert('Error', 'No se pudo eliminar el producto');
    });
  }


  delSelectedProducts() {
    const selectedProducts = this.productos.filter(producto => producto.seleccionado);
    if (selectedProducts.length > 0) {
      selectedProducts.forEach(producto => {
        this.delProduct(producto);
      });


      this.alert.showAlert('Productos Eliminados', 'Se han eliminado los productos seleccionados');
    } else {

      this.alert.showAlert('Sin selección', 'No has seleccionado productos para eliminar');
    }
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  goBack() {
    this.location.back();
  }
}
