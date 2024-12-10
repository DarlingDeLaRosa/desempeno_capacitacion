import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcuerdoEvaluacionComponent } from './acuerdo-evaluacion.component';

describe('AcuerdoEvaluacionComponent', () => {
  let component: AcuerdoEvaluacionComponent;
  let fixture: ComponentFixture<AcuerdoEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcuerdoEvaluacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcuerdoEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
