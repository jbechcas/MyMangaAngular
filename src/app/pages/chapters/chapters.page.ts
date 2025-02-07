import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Chapter } from '../../core/models/chapter.model';
import { Manga } from '../../core/models/manga.model';
import { Paginated } from '../../core/models/paginated.model';
import { ChapterService } from '../../core/services/impl/chapter.service';
import { MangaService } from '../../core/services/impl/manga.service';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.page.html',
  styleUrls: ['./chapters.page.scss'],
})
export class ChaptersPage implements OnInit {
  private pageSize = 40;
  private page = 1;
  private refresh$ = new BehaviorSubject<void>(undefined);
  chapters$: Observable<Paginated<Chapter>>;
  mangas: Manga[] = [];
  selectedChapter: Chapter | null = null;

  constructor(
    private chapterSvc: ChapterService,
    private mangaSvc: MangaService,
    private alertCtrl: AlertController
  ) {
    this.chapters$ = this.refresh$.pipe(
      switchMap(() => this.chapterSvc.getAll(this.page, this.pageSize)),
      tap(response => {
        console.log('Chapters response:', response);
      })
    );
  }

  ngOnInit() {
    this.loadMangas();
    this.refresh$.next();
  }

  loadMangas() {
    this.mangaSvc.getAll(-1, 100).subscribe({
      next: (response: any) => {
        this.mangas = response;
        console.log('Mangas loaded:', this.mangas);
      },
      error: (error) => console.error('Error loading mangas:', error)
    });
  }

  getMangaTitle(mangaId: string | undefined): string {
    const manga = this.mangas.find(m => m.id === mangaId);
    return manga ? manga.title : 'Sin manga asignado';
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
          text: 'Siguiente',
          handler: async (data) => {
            const selectManga = await this.alertCtrl.create({
              header: 'Seleccionar Manga',
              inputs: this.mangas.map(manga => ({
                name: 'mangaId',
                type: 'radio',
                label: manga.title,
                value: manga.id
              })),
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel'
                },
                {
                  text: 'Añadir',
                  handler: (mangaData) => {
                    const newChapter: Partial<Chapter> = {
                      title: data.title,
                      description: data.description,
                      mangaId: mangaData
                    };
                    
                    this.chapterSvc.add(newChapter as Chapter).subscribe({
                      next: () => {
                        this.refresh$.next();
                      },
                      error: (error) => console.error('Error adding chapter:', error)
                    });
                  }
                }
              ]
            });

            await selectManga.present();
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
          text: 'Siguiente',
          handler: async (data) => {
            const selectManga = await this.alertCtrl.create({
              header: 'Seleccionar Manga',
              inputs: this.mangas.map(manga => ({
                name: 'mangaId',
                type: 'radio',
                label: manga.title,
                value: manga.id,
                checked: manga.id === chapter.mangaId
              })),
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel'
                },
                {
                  text: 'Actualizar',
                  handler: (mangaData) => {
                    const updatedChapter: Partial<Chapter> = {
                      ...chapter,
                      title: data.title,
                      description: data.description,
                      mangaId: mangaData
                    };
                    
                    this.chapterSvc.update(chapter.id, updatedChapter as Chapter).subscribe({
                      next: () => {
                        this.refresh$.next();
                        this.selectedChapter = null;
                      },
                      error: (error) => console.error('Error updating chapter:', error)
                    });
                  }
                }
              ]
            });

            await selectManga.present();
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
            this.chapterSvc.delete(chapter.id).subscribe({
              next: () => {
                this.refresh$.next();
                this.selectedChapter = null;
              },
              error: (error) => console.error('Error deleting chapter:', error)
            });
          }
        }
      ]
    });

    await alert.present();
  }
}