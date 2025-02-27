// src/app/repositories/repository.factory.ts
// Añadir estas importaciones al inicio
import { Manga } from '../models/manga.model';
import { Chapter } from '../models/chapter.model';
import { MANGA_REPOSITORY_TOKEN, MANGA_API_URL_TOKEN, MANGA_REPOSITORY_MAPPING_TOKEN, MANGA_RESOURCE_NAME_TOKEN, CHAPTER_REPOSITORY_TOKEN, CHAPTER_API_URL_TOKEN, CHAPTER_REPOSITORY_MAPPING_TOKEN, CHAPTER_RESOURCE_NAME_TOKEN } from './repository.tokens';
import { MangaMappingStrapi } from './impl/manga-mapping-strapi.service';
import { ChapterMappingStrapi } from './impl/chapter-mapping-strapi.service';
import { FactoryProvider, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRepositoryHttpService } from './impl/base-repository-http.service';
import { IBaseRepository } from './intefaces/base-repository.interface';
import { Person } from '../models/person.model';
import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, PEOPLE_API_URL_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN, PEOPLE_REPOSITORY_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN, UPLOAD_API_URL_TOKEN } from './repository.tokens';
import { BaseRespositoryLocalStorageService } from './impl/base-repository-local-storage.service';
import { Model } from '../models/base.model';
import { IBaseMapping } from './intefaces/base-mapping.interface';
import { JsonServerRepositoryService } from './impl/json-server-repository.service';
import { StrapiRepositoryService } from './impl/strapi-repository.service';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { IAuthMapping } from '../services/interfaces/auth-mapping.interface';
import { StrapiAuthenticationService } from '../services/impl/strapi-authentication.service';
import { PeopleMappingStrapi } from './impl/people-mapping-strapi.service';
import { StrapiAuthMappingService } from '../services/impl/strapi-auth-mapping.service';
import { IStrapiAuthentication } from '../services/interfaces/strapi-authentication.interface';
import { StrapiMediaService } from '../services/impl/strapi-media.service';
import { BaseMediaService } from '../services/impl/base-media.service';


export function createBaseRepositoryFactory<T extends Model>(
  token: InjectionToken<IBaseRepository<T>>,
  dependencies:any[]): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string, http: HttpClient, auth:IStrapiAuthentication, apiURL: string, resource: string, mapping: IBaseMapping<T>) => {
      switch (backend) {
        case 'http':
          return new BaseRepositoryHttpService<T>(http, auth, apiURL, resource, mapping);
        case 'strapi':
          return new StrapiRepositoryService<T>(http, auth, apiURL, resource, mapping);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};

export function createBaseMappingFactory<T extends Model>(
  token: InjectionToken<IBaseMapping<T>>,
  dependencies: any[],
  modelType: 'person' | 'manga' | 'chapter'
): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string) => {
      switch (backend) {
        case 'strapi':
          return modelType === 'person'
            ? new PeopleMappingStrapi()
            : modelType === 'manga'
            ? new MangaMappingStrapi()
            : modelType === 'chapter'
            ? new ChapterMappingStrapi()
            : null;
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};

export function createBaseAuthMappingFactory(token: InjectionToken<IAuthMapping>, dependencies:any[]): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string) => {
      switch (backend) {
        case 'http':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'local-storage':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'json-server':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'strapi':
          return new StrapiAuthMappingService();
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};


export const PeopleMappingFactory = createBaseMappingFactory<Person>(
  PEOPLE_REPOSITORY_MAPPING_TOKEN, 
  [BACKEND_TOKEN],
  'person'
);


export const MangaMappingFactory = createBaseMappingFactory<Manga>(
  MANGA_REPOSITORY_MAPPING_TOKEN, 
  [BACKEND_TOKEN],
  'manga'
);

export const ChapterMappingFactory = createBaseMappingFactory<Chapter>(
  CHAPTER_REPOSITORY_MAPPING_TOKEN, 
  [BACKEND_TOKEN],
  'chapter'
);

export const AuthMappingFactory: FactoryProvider = createBaseAuthMappingFactory(AUTH_MAPPING_TOKEN, [BACKEND_TOKEN]);

export const AuthenticationServiceFactory:FactoryProvider = {
  provide: BaseAuthenticationService,
  useFactory: (backend:string, signIn:string, signUp:string, meUrl:string, mapping:IAuthMapping, http:HttpClient) => {
    switch(backend){
      case 'http':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'strapi':
        return new StrapiAuthenticationService(signIn, signUp, meUrl, mapping, http);
      default:
        throw new Error("BACKEND NOT IMPLEMENTED");
    }
    
  },
  deps: [BACKEND_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_MAPPING_TOKEN, HttpClient]
};

export const MediaServiceFactory:FactoryProvider = {
  provide: BaseMediaService,
  useFactory: (backend:string, upload:string, auth:IStrapiAuthentication, http:HttpClient) => {
    switch(backend){
      case 'http':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'local-storage':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'json-server':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'strapi':
        return new StrapiMediaService(upload, auth, http);
      default:
        throw new Error("BACKEND NOT IMPLEMENTED");
    }
    
  },
  deps: [BACKEND_TOKEN, UPLOAD_API_URL_TOKEN, BaseAuthenticationService, HttpClient]
};

export const PeopleRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Person>(PEOPLE_REPOSITORY_TOKEN,
  [BACKEND_TOKEN, HttpClient, BaseAuthenticationService, PEOPLE_API_URL_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN]
);

export const MangaRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Manga>(MANGA_REPOSITORY_TOKEN,
  [BACKEND_TOKEN, HttpClient, BaseAuthenticationService, MANGA_API_URL_TOKEN, MANGA_RESOURCE_NAME_TOKEN, MANGA_REPOSITORY_MAPPING_TOKEN]
);

export const ChapterRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Chapter>(CHAPTER_REPOSITORY_TOKEN,
  [BACKEND_TOKEN, HttpClient, BaseAuthenticationService, CHAPTER_API_URL_TOKEN, CHAPTER_RESOURCE_NAME_TOKEN, CHAPTER_REPOSITORY_MAPPING_TOKEN]
);