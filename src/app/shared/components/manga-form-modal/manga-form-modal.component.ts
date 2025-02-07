import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { Manga } from 'src/app/core/models/manga.model';

@Component({
  selector: 'app-manga-form-modal',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>{{ mode === 'new' ? 'Nuevo' : 'Editar' }} Manga</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
        <ion-list>
          <ion-item>
            <ion-label position="floating">Título</ion-label>
            <ion-input formControlName="title" type="text"></ion-input>
          </ion-item>
          <ion-text color="danger" class="ion-padding-start" *ngIf="title.touched && title.errors?.['required']">
            El título es requerido
          </ion-text>
          <ion-text color="danger" class="ion-padding-start" *ngIf="title.touched && title.errors?.['minlength']">
            El título debe tener al menos 2 caracteres
          </ion-text>

          <ion-item>
            <ion-label position="floating">Descripción</ion-label>
            <ion-textarea 
              formControlName="description" 
              rows="6">
            </ion-textarea>
          </ion-item>
        </ion-list>

        <div class="ion-padding">
          <ion-button 
            expand="block"
            type="submit"
            [disabled]="!formGroup.valid">
            {{ mode === 'new' ? 'Crear' : 'Actualizar' }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  `,
  styles: [`
    ion-content {
      --background: var(--ion-background-color);
    }

    ion-item {
      --background: rgba(255, 255, 255, 0.05);
      --border-radius: 12px;
      --border-color: rgba(255, 255, 255, 0.1);
      margin-bottom: 1rem;
    }

    ion-textarea {
      --background: rgba(255, 255, 255, 0.05);
      --border-radius: 8px;
      --padding-start: 1rem;
      --padding-end: 1rem;
      --padding-top: 0.5rem;
      margin-top: 0.5rem;
    }
  `]
})
export class MangaFormModalComponent {
  formGroup: FormGroup;
  mode: 'new'|'edit' = 'new';
  isMobile: boolean = false;

  @Input() set manga(_manga: Manga) {
    if (_manga && _manga.id) {
      this.mode = 'edit';
      this.formGroup.patchValue({
        title: _manga.title,
        description: _manga.description
      });
    }
  }

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private platform: Platform
  ) { 
    this.isMobile = this.platform.is('ios') || this.platform.is('android');
    this.formGroup = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  get title() {
    return this.formGroup.controls['title'];
  }

  get description() {
    return this.formGroup.controls['description'];
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.modalCtrl.dismiss(
        this.formGroup.value,
        this.mode
      );
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}