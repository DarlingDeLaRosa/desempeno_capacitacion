import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutaEvaluacionCompetenciaComponent } from './minuta-evaluacion-competencia.component';

describe('MinutaEvaluacionCompetenciaComponent', () => {
  let component: MinutaEvaluacionCompetenciaComponent;
  let fixture: ComponentFixture<MinutaEvaluacionCompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinutaEvaluacionCompetenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinutaEvaluacionCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
