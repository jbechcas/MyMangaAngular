import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Person } from 'src/app/core/models/person.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';
import { PeopleService } from 'src/app/core/services/impl/people.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  formGroup: FormGroup;
  person?: Person | null;
profilePicture: any;

  constructor(
    private formBuilder: FormBuilder,
    private peopleService: PeopleService,
    private authService: BaseAuthenticationService,
    private mediaService: BaseMediaService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private translateService: TranslateService
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      picture: ['']
    });
  }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const user = await this.authService.getCurrentUser();
      if (user) {
        this.person = await lastValueFrom(this.peopleService.getByUserId(user.id));
        
        if (this.person) {
          const updatedPerson: any = {
            ...this.person,
            email: user.email,
            userId: user.id,
            picture: typeof this.person.picture === 'object' ? 
              this.person.picture.url : 
              undefined
          };
          this.formGroup.patchValue(updatedPerson);
        }
      }
    } catch (error) {
      console.error(error);
      const toast = await this.toastController.create({
        message: await lastValueFrom(this.translateService.get('COMMON.ERROR.LOAD')),
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  async onSubmit() {
    if (this.formGroup.valid && this.person) {
      const loading = await this.loadingController.create();
      await loading.present();

      try {
        const changedValues = {} as Record<keyof Person, any>;
        Object.keys(this.formGroup.controls).forEach(key => {
          if (this.formGroup.get(key)?.dirty) {
            changedValues[key as keyof Person] = this.formGroup.get(key)?.value;
          }
        })

        await lastValueFrom(this.peopleService.update(this.person.id, changedValues));

        const toast = await this.toastController.create({
          message: await lastValueFrom(this.translateService.get('COMMON.SUCCESS.SAVE')),
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
        
        this.formGroup.markAsPristine();
      } catch (error) {
        console.error(error);
        const toast = await this.toastController.create({
          message: await lastValueFrom(this.translateService.get('COMMON.ERROR.SAVE')),
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
      } finally {
        await loading.dismiss();
      }
    }
  }

  get name() {
    return this.formGroup.controls['name'];
  }

  get surname() {
    return this.formGroup.controls['surname'];
  }

  get email() {
    return this.formGroup.controls['email'];
  }

}