import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TiendasCercanasPageRoutingModule } from './tiendas-cercanas-routing.module';

import { TiendasCercanasPage } from './tiendas-cercanas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TiendasCercanasPageRoutingModule
  ],
  declarations: [TiendasCercanasPage]
})
export class TiendasCercanasPageModule {}
