import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupSelectableComponent } from './components/group-selectable/group-selectable.component';
import { PictureSelectableComponent } from './components/picture-selectable/picture-selectable.component';
import { PersonModalComponent } from './components/person-modal/person-modal.component';
import { MangaFormComponent } from './components/manga-form/manga-form.component'; // Añadir esta línea
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ChapterFormComponent } from './components/chapter-form/chapter-form.component';

@NgModule({
  declarations: [
    PersonModalComponent, 
    GroupSelectableComponent, 
    PictureSelectableComponent,
    MangaFormComponent,
    ChapterFormComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  exports: [
    PersonModalComponent, 
    GroupSelectableComponent, 
    PictureSelectableComponent,
    MangaFormComponent,
    ChapterFormComponent
  ]
})
export class SharedModule { }