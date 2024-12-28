import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerComportamientosProbatoriosComponent } from './ver-comportamientos-probatorios.component';

describe('VerComportamientosProbatoriosComponent', () => {
  let component: VerComportamientosProbatoriosComponent;
  let fixture: ComponentFixture<VerComportamientosProbatoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerComportamientosProbatoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerComportamientosProbatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
