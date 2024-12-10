import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcuerdoEditarComponent } from './acuerdo-editar.component';

describe('AcuerdoEditarComponent', () => {
  let component: AcuerdoEditarComponent;
  let fixture: ComponentFixture<AcuerdoEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcuerdoEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcuerdoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
