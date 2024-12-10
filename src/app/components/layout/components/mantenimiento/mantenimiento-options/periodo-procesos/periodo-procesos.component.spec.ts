import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodoProcesosComponent } from './periodo-procesos.component';

describe('PeriodoProcesosComponent', () => {
  let component: PeriodoProcesosComponent;
  let fixture: ComponentFixture<PeriodoProcesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodoProcesosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodoProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
