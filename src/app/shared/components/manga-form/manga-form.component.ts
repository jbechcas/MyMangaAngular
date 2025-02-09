import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Manga } from '../../../core/models/manga.model';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';

@Component({
  selector: 'app-manga-form',
  templateUrl: './manga-form.component.html',
  styleUrls: ['./manga-form.component.scss']
})
export class MangaFormComponent implements OnInit {
  @Input() manga?: Manga;
  mangaForm: FormGroup;
  isEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private mediaSvc: BaseMediaService
  ) {
    this.mangaForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    if (this.manga) {
      this.isEdit = true;
      this.mangaForm.patchValue({
        title: this.manga.title,
        description: this.manga.description
      });
    }
  }

  get title() {
    return this.mangaForm.get('title');
  }

  async onSubmit() {
    if (this.mangaForm.valid) {
      const formData = this.mangaForm.value;
      this.modalCtrl.dismiss(formData, this.isEdit ? 'edit' : 'create');
    }
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}