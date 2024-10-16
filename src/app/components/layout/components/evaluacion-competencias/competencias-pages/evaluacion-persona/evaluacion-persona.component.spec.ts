import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionPersonaComponent } from './evaluacion-persona.component';

describe('EvaluacionPersonaComponent', () => {
  let component: EvaluacionPersonaComponent;
  let fixture: ComponentFixture<EvaluacionPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionPersonaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
