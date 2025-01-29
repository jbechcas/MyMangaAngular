import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { Manga } from '../../models/manga.model';
import { MANGA_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { IMangaService } from '../interfaces/manga-service.interface';
import { IBaseRepository, SearchParams } from '../../repositories/intefaces/base-repository.interface';
import { Observable } from 'rxjs';
import { Paginated } from '../../models/paginated.model';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MangaService extends BaseService<Manga> implements IMangaService {
    constructor(
        @Inject(MANGA_REPOSITORY_TOKEN) repository: IBaseRepository<Manga>
    ) {
        super(repository);
    }


}