import { Component, OnDestroy } from '@angular/core';
import { LanguageService } from './core/services/language.service';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { Router } from '@angular/router';
import { PeopleService } from './core/services/impl/people.service';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';

@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
openProfile() {
throw new Error('Method not implemented.');
}
 currentLang: string;
 profilePicture: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';
 private destroy$ = new Subject<void>();

 constructor(
   private languageService: LanguageService,
   public authSvc: BaseAuthenticationService,
   private peopleSvc: PeopleService,
   private router: Router
 ) {
   this.currentLang = this.languageService.getStoredLanguage();

 }



 changeLanguage(lang: string) {
   this.languageService.changeLanguage(lang);
   this.currentLang = lang;
   this.languageService.storeLanguage(lang);
 }

 logout() {
   this.authSvc.signOut().subscribe(() => {
     this.profilePicture = 'https://ionicframework.com/docs/img/demos/avatar.svg';
     this.router.navigate(['/login']);
   });
 }

 ngOnDestroy() {
   this.destroy$.next();
   this.destroy$.complete();
 }
}