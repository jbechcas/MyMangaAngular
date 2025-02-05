// src/app/services/impl/chapter.service.ts
import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { IChapterService } from '../interfaces/chapter-service.interface';
import { Chapter } from '../../models/chapter.model';
import { CHAPTER_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { IChapterRepository } from '../../repositories/intefaces/chapter-repository.interface';

@Injectable({
  providedIn: 'root'
})
export class ChapterService extends BaseService<Chapter> implements IChapterService {
  constructor(
    @Inject(CHAPTER_REPOSITORY_TOKEN) repository: IChapterRepository
  ) {
    super(repository);
  }
  
}