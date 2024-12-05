import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TiendasCercanasPage } from './tiendas-cercanas.page';

describe('TiendasCercanasPage', () => {
  let component: TiendasCercanasPage;
  let fixture: ComponentFixture<TiendasCercanasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TiendasCercanasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
