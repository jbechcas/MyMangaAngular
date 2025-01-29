import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Manga } from '../../core/models/manga.model';
import { Paginated } from '../../core/models/paginated.model';
import { MangaService } from '../../core/services/impl/manga.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private pageSize = 10;
  private page = 1;
  private refresh$ = new BehaviorSubject<void>(undefined);
  mangas$: Observable<Paginated<Manga>>;

  constructor(
    private mangaSvc: MangaService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    this.mangas$ = this.refresh$.pipe(
      switchMap(() => this.mangaSvc.getAll(this.page, this.pageSize))
    );
  }

  ngOnInit() {
    this.refresh$.next();
    console.log('Refresh mangas');
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
            });
          }
        }
      ]
    });

    await alert.present();
  }

  loadMore(event: any) {
    this.page++;
    this.mangaSvc.getAll(this.page, this.pageSize).subscribe(
      (result) => {
        event.target.complete();
        if (result.data.length < this.pageSize) {
          event.target.disabled = true;
        }
        this.refresh$.next();
      },
      (error) => {
        console.error('Error loading more mangas:', error);
        event.target.complete();
      }
    );
  }
}