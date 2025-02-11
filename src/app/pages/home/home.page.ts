import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Chapter } from '../../core/models/chapter.model';
import { Manga } from '../../core/models/manga.model';
import { Paginated } from '../../core/models/paginated.model';
import { ChapterService } from '../../core/services/impl/chapter.service';
import { MangaService } from '../../core/services/impl/manga.service';
import { MangaFormComponent } from '../../shared/components/manga-form/manga-form.component';
import { ChapterFormComponent } from '../../shared/components/chapter-form/chapter-form.component';

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
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
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

  async addManga() {
    const modal = await this.modalCtrl.create({
      component: MangaFormComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'create' && result.data) {
        this.mangaSvc.add(result.data as Manga).subscribe(() => {
          this.refresh$.next();
        });
      }
    });

    return await modal.present();
  }

  async editManga(manga: Manga) {
    const modal = await this.modalCtrl.create({
      component: MangaFormComponent,
      componentProps: {
        manga: manga
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'edit' && result.data) {
        this.mangaSvc.update(manga.id, result.data as Manga).subscribe(() => {
          this.refresh$.next();
          this.closeMangaModal();
        });
      }
    });

    return await modal.present();
  }

  async addChapter(manga: Manga) {
    const modal = await this.modalCtrl.create({
      component: ChapterFormComponent,
      componentProps: {
        mangaId: manga.id
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'create' && result.data) {
        this.chapterSvc.add(result.data as Chapter).subscribe(() => {
          this.loadMangaChapters(manga.id);
        });
      }
    });

    return await modal.present();
  }

  async editChapter(chapter: Chapter) {
    const modal = await this.modalCtrl.create({
      component: ChapterFormComponent,
      componentProps: {
        chapter: chapter,
        mangaId: chapter.mangaId
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'edit' && result.data) {
        this.chapterSvc.update(chapter.id, result.data as Chapter).subscribe(() => {
          this.loadMangaChapters(chapter.mangaId!);
        });
      }
    });

    return await modal.present();
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