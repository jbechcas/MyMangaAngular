import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Manga } from '../../core/models/manga.model';
import { Paginated } from '../../core/models/paginated.model';
import { MangaService } from '../../core/services/impl/manga.service';
import { MangaFormComponent } from '../../shared/components/manga-form/manga-form.component';

@Component({
  selector: 'app-mangas',
  templateUrl: './mangas.page.html',
  styleUrls: ['./mangas.page.scss'],
})
export class MangasPage implements OnInit {
  private pageSize = 20;
  private page = 1;
  private refresh$ = new BehaviorSubject<void>(undefined);
  mangas$: Observable<Paginated<Manga>>;
  selectedManga: Manga | null = null;

  constructor(
    private mangaSvc: MangaService,
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
          this.selectedManga = null;
        });
      }
    });

    return await modal.present();
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
              this.selectedManga = null;
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
