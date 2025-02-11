import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MangasPageRoutingModule } from './mangas-routing.module';

import { MangasPage } from './mangas.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MangasPageRoutingModule,
    SharedModule
],
  declarations: [MangasPage]
})
export class MangasPageModule {}
