import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MangaFormComponent } from './components/manga-form/manga-form.component'; // Añadir esta línea
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ChapterFormComponent } from './components/chapter-form/chapter-form.component';
import { FormatoTituloPipe } from './pipes/formato-titulo.pipe';

@NgModule({
  declarations: [
    MangaFormComponent,
    ChapterFormComponent,
    FormatoTituloPipe
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  exports: [
    MangaFormComponent,
    ChapterFormComponent,
    FormatoTituloPipe
  ]
})
export class SharedModule { }