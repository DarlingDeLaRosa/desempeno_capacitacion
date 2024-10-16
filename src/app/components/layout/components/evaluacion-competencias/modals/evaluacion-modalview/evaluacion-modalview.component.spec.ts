import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionModalviewComponent } from './evaluacion-modalview.component';

describe('EvaluacionModalviewComponent', () => {
  let component: EvaluacionModalviewComponent;
  let fixture: ComponentFixture<EvaluacionModalviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionModalviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionModalviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
