import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Chapter } from '../../../core/models/chapter.model';

@Component({
  selector: 'app-chapter-form',
  templateUrl: './chapter-form.component.html',
  styleUrls: ['./chapter-form.component.scss']
})
export class ChapterFormComponent implements OnInit {
  @Input() chapter?: Chapter;
  @Input() mangaId!: string;
  chapterForm: FormGroup;
  isEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.chapterForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    if (this.chapter) {
      this.isEdit = true;
      this.chapterForm.patchValue({
        title: this.chapter.title,
        description: this.chapter.description
      });
    }
  }

  get title() {
    return this.chapterForm.get('title');
  }

  async onSubmit() {
    if (this.chapterForm.valid) {
      const formData = {
        ...this.chapterForm.value,
        mangaId: this.mangaId
      };
      this.modalCtrl.dismiss(formData, this.isEdit ? 'edit' : 'create');
    }
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}