import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MangasPage } from './mangas.page';

const routes: Routes = [
  {
    path: '',
    component: MangasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MangasPageRoutingModule {}
