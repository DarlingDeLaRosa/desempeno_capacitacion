import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSupervisadoEvaluacionComponent } from './view-supervisado-evaluacion.component';

describe('ViewSupervisadoEvaluacionComponent', () => {
  let component: ViewSupervisadoEvaluacionComponent;
  let fixture: ComponentFixture<ViewSupervisadoEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSupervisadoEvaluacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSupervisadoEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
