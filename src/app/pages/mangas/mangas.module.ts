import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MangasPageRoutingModule } from './mangas-routing.module';

import { MangasPage } from './mangas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MangasPageRoutingModule
  ],
  declarations: [MangasPage]
})
export class MangasPageModule {}
