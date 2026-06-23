import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderStepperBoxComponent } from './loader-stepper-box.component';

describe('LoaderStepperBoxComponent', () => {
  let component: LoaderStepperBoxComponent;
  let fixture: ComponentFixture<LoaderStepperBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderStepperBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderStepperBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
