// chapters.page.ts
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Chapter } from '../../core/models/chapter.model';
import { Manga } from '../../core/models/manga.model';
import { Paginated } from '../../core/models/paginated.model';
import { ChapterService } from '../../core/services/impl/chapter.service';
import { MangaService } from '../../core/services/impl/manga.service';
import { ChapterFormComponent } from '../../shared/components/chapter-form/chapter-form.component';

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
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
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

  getMangaImageUrl(mangaId: string | undefined): string {
    const manga = this.mangas.find(m => m.id === mangaId);
    return manga && manga.picture && manga.picture.url ? manga.picture.url : '/assets/placeholder-chapter.jpg';  
  }

  async addChapter() {
    const modal = await this.modalCtrl.create({
      component: ChapterFormComponent,
      componentProps: {
        mangas: this.mangas
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'create' && result.data) {
        this.chapterSvc.add(result.data as Chapter).subscribe({
          next: () => {
            this.refresh$.next();
          },
          error: (error) => console.error('Error adding chapter:', error)
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
        mangas: this.mangas,
        mangaId: chapter.mangaId
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'edit' && result.data) {
        this.chapterSvc.update(chapter.id, result.data as Chapter).subscribe({
          next: () => {
            this.refresh$.next();
          },
          error: (error) => console.error('Error updating chapter:', error)
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

  openChapterModal(chapter: Chapter) {
    this.selectedChapter = chapter;
  }
}