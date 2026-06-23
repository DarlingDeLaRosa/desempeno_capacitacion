import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcuerdoEvaluacionProvisionalComponent } from './acuerdo-evaluacion-provisional.component';

describe('AcuerdoEvaluacionProvisionalComponent', () => {
  let component: AcuerdoEvaluacionProvisionalComponent;
  let fixture: ComponentFixture<AcuerdoEvaluacionProvisionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcuerdoEvaluacionProvisionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcuerdoEvaluacionProvisionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
