import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Chapter } from '../../core/models/chapter.model';
import { Paginated } from '../../core/models/paginated.model';
import { ChapterService } from '../../core/services/impl/chapter.service';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.page.html',
  styleUrls: ['./chapters.page.scss'],
})
export class ChaptersPage implements OnInit {
  private pageSize = 20;
  private page = 1;
  private refresh$ = new BehaviorSubject<void>(undefined);
  chapters$: Observable<Paginated<Chapter>>;
  selectedChapter: Chapter | null = null;

  constructor(
    private chapterSvc: ChapterService,
    private alertCtrl: AlertController
  ) {
    this.chapters$ = this.refresh$.pipe(
      switchMap(() => this.chapterSvc.getAll(this.page, this.pageSize))
    );
  }

  ngOnInit() {
    this.refresh$.next();
  }

  openChapterModal(chapter: Chapter) {
    this.selectedChapter = chapter;
  }

  closeChapterModal() {
    this.selectedChapter = null;
  }

  async addChapter() {
    const alert = await this.alertCtrl.create({
      header: 'Añadir Capítulo',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título del capítulo'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Añadir',
          handler: (data) => {
            const newChapter: Partial<Chapter> = {
              title: data.title,
              description: data.description
            };
            
            this.chapterSvc.add(newChapter as Chapter).subscribe(() => {
              this.refresh$.next();
              this.closeChapterModal();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async editChapter(chapter: Chapter) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Capítulo',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título del capítulo',
          value: chapter.title
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción',
          value: chapter.description
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Actualizar',
          handler: (data) => {
            const updatedChapter: Partial<Chapter> = {
              ...chapter,
              title: data.title,
              description: data.description
            };
            
            this.chapterSvc.update(chapter.id, updatedChapter as Chapter).subscribe(() => {
              this.refresh$.next();
              this.closeChapterModal();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteChapter(chapter: Chapter) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este capítulo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.chapterSvc.delete(chapter.id).subscribe(() => {
              this.refresh$.next();
              this.closeChapterModal();
            });
          }
        }
      ]
    });

    await alert.present();
  }
}