import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcuerdoCalificacionComponent } from './acuerdo-calificacion.component';

describe('AcuerdoCalificacionComponent', () => {
  let component: AcuerdoCalificacionComponent;
  let fixture: ComponentFixture<AcuerdoCalificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcuerdoCalificacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcuerdoCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
