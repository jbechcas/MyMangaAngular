import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Chapter } from '../../core/models/chapter.model';
import { Manga } from '../../core/models/manga.model';
import { Paginated } from '../../core/models/paginated.model';
import { ChapterService } from '../../core/services/impl/chapter.service';
import { MangaService } from '../../core/services/impl/manga.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private pageSize = 20;
  private page = 1;
  private refresh$ = new BehaviorSubject<void>(undefined);
  mangas$: Observable<Paginated<Manga>>;
  selectedManga: Manga | null = null;
  mangaChapters: Chapter[] = [];

  constructor(
    private mangaSvc: MangaService,
    private chapterSvc: ChapterService,
    private alertCtrl: AlertController
  ) {
    this.mangas$ = this.refresh$.pipe(
      switchMap(() => this.mangaSvc.getAll(this.page, this.pageSize))
    );
  }

  ngOnInit() {
    this.refresh$.next();
  }

  async openMangaModal(manga: Manga) {
    this.selectedManga = manga;
    this.loadMangaChapters(manga.id);
  }

  loadMangaChapters(mangaId: string) {
    this.chapterSvc.getAll(-1, 100).subscribe({
      next: (response: any) => {
        // Filtramos los capítulos que pertenecen a este manga
        this.mangaChapters = response.filter((chapter: Chapter) => 
          chapter.mangaId === mangaId
        );
        console.log('Chapters for manga:', this.mangaChapters);
      },
      error: (error) => console.error('Error loading chapters:', error)
    });
  }

  closeMangaModal() {
    this.selectedManga = null;
    this.mangaChapters = [];
  }

  async addChapter(manga: Manga) {
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
              description: data.description,
              mangaId: manga.id
            };
            
            this.chapterSvc.add(newChapter as Chapter).subscribe({
              next: () => {
                this.loadMangaChapters(manga.id);
              },
              error: (error) => console.error('Error adding chapter:', error)
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
            
            this.chapterSvc.update(chapter.id, updatedChapter as Chapter).subscribe({
              next: () => {
                this.loadMangaChapters(chapter.mangaId!);
              },
              error: (error) => console.error('Error updating chapter:', error)
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
            this.chapterSvc.delete(chapter.id).subscribe({
              next: () => {
                this.loadMangaChapters(chapter.mangaId!);
              },
              error: (error) => console.error('Error deleting chapter:', error)
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async addManga() {
    const alert = await this.alertCtrl.create({
      header: 'Añadir Manga',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título del manga'
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
            const newManga: Partial<Manga> = {
              title: data.title,
              description: data.description
            };
            
            this.mangaSvc.add(newManga as Manga).subscribe(() => {
              this.refresh$.next();
              this.closeMangaModal();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async editManga(manga: Manga) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Manga',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título del manga',
          value: manga.title
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción',
          value: manga.description
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
            const updatedManga: Partial<Manga> = {
              ...manga,
              title: data.title,
              description: data.description
            };
            
            this.mangaSvc.update(manga.id, updatedManga as Manga).subscribe(() => {
              this.refresh$.next();
              this.closeMangaModal();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteManga(manga: Manga) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este manga?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.mangaSvc.delete(manga.id).subscribe(() => {
              this.refresh$.next();
              this.closeMangaModal();
            });
          }
        }
      ]
    });

    await alert.present();
  }
}