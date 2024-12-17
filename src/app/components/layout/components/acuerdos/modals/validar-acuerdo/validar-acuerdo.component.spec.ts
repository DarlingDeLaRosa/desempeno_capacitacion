import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarAcuerdoComponent } from './validar-acuerdo.component';

describe('ValidarAcuerdoComponent', () => {
  let component: ValidarAcuerdoComponent;
  let fixture: ComponentFixture<ValidarAcuerdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidarAcuerdoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidarAcuerdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
