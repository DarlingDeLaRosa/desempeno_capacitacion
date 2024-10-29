import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionAcuerdoComponent } from './asignacion-acuerdo.component';

describe('AsignacionAcuerdoComponent', () => {
  let component: AsignacionAcuerdoComponent;
  let fixture: ComponentFixture<AsignacionAcuerdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionAcuerdoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionAcuerdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
