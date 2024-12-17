import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoRecomendacionComponent } from './resultado-recomendacion.component';

describe('ResultadoRecomendacionComponent', () => {
  let component: ResultadoRecomendacionComponent;
  let fixture: ComponentFixture<ResultadoRecomendacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoRecomendacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoRecomendacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
