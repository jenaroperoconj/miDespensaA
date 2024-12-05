import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiendasCercanasPage } from './tiendas-cercanas.page';

const routes: Routes = [
  {
    path: '',
    component: TiendasCercanasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiendasCercanasPageRoutingModule {}
