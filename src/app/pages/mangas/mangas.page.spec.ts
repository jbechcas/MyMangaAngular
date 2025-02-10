import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MangasPage } from './mangas.page';

describe('MangasPage', () => {
  let component: MangasPage;
  let fixture: ComponentFixture<MangasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MangasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
