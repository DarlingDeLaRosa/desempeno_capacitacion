import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionProvisionalComponent } from './evaluacion-provisional.component';

describe('EvaluacionProvisionalComponent', () => {
  let component: EvaluacionProvisionalComponent;
  let fixture: ComponentFixture<EvaluacionProvisionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionProvisionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionProvisionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
