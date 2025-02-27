// src/app/app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { 
  AuthenticationServiceFactory, 
  AuthMappingFactory, 
  MediaServiceFactory, 
  PeopleMappingFactory, 
  PeopleRepositoryFactory,
  MangaMappingFactory,
  MangaRepositoryFactory, 
  ChapterMappingFactory,
  ChapterRepositoryFactory
} from './core/repositories/repository.factory';
import { PeopleService } from './core/services/impl/people.service';
import { MangaService } from './core/services/impl/manga.service';
import { 
  AUTH_MAPPING_TOKEN, 
  AUTH_ME_API_URL_TOKEN, 
  AUTH_SIGN_IN_API_URL_TOKEN, 
  AUTH_SIGN_UP_API_URL_TOKEN, 
  BACKEND_TOKEN, 
  MANGA_API_URL_TOKEN,
  MANGA_RESOURCE_NAME_TOKEN,
  PEOPLE_API_URL_TOKEN, 
  PEOPLE_REPOSITORY_MAPPING_TOKEN, 
  PEOPLE_RESOURCE_NAME_TOKEN,
  CHAPTER_API_URL_TOKEN, 
  CHAPTER_REPOSITORY_MAPPING_TOKEN, 
  CHAPTER_RESOURCE_NAME_TOKEN,  
  UPLOAD_API_URL_TOKEN 
} from './core/repositories/repository.tokens';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PeopleMappingStrapi } from './core/repositories/impl/people-mapping-strapi.service';
import { ChapterMappingStrapi } from './core/repositories/impl/chapter-mapping-strapi.service';
import { StrapiAuthMappingService } from './core/services/impl/strapi-auth-mapping.service';
import { StrapiAuthenticationService } from './core/services/impl/strapi-authentication.service';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { environment } from 'src/environments/environment';
import { ChapterService } from './core/services/impl/chapter.service';

// Factory function para el loader de traducción
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideLottieOptions({
      player: () => player,
    }),
    provideHttpClient(),
    { provide: BACKEND_TOKEN, useValue: 'strapi' },
    
    { provide: PEOPLE_RESOURCE_NAME_TOKEN, useValue: 'people' },
    { provide: MANGA_RESOURCE_NAME_TOKEN, useValue: 'mangas' },
    { provide: CHAPTER_RESOURCE_NAME_TOKEN, useValue: 'chapters' }, 
    
    { provide: PEOPLE_API_URL_TOKEN, useValue: `${environment.apiUrl}/api` },
    { provide: CHAPTER_API_URL_TOKEN, useValue: `${environment.apiUrl}/api` }, 
    { provide: MANGA_API_URL_TOKEN, useValue: `${environment.apiUrl}/api` },
    
    { provide: AUTH_SIGN_IN_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/auth/local` },
    { provide: AUTH_SIGN_UP_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/auth/local/register` },
    { provide: AUTH_ME_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/users/me` },
    { provide: UPLOAD_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/upload` },
  
    PeopleMappingFactory,
    AuthMappingFactory,
    PeopleRepositoryFactory,
    MangaMappingFactory,
    MangaRepositoryFactory,
    ChapterMappingFactory,
    ChapterRepositoryFactory,
    
    {
      provide: 'PeopleService',
      useClass: PeopleService
    },
    {
      provide: 'MangaService',
      useClass: MangaService
    },
    {
      provide: 'ChapterService',
      useClass: ChapterService
    },
    AuthenticationServiceFactory,
    MediaServiceFactory
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
