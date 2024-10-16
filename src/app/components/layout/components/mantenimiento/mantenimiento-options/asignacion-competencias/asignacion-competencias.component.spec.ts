import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionCompetenciasComponent } from './asignacion-competencias.component';

describe('AsignacionCompetenciasComponent', () => {
  let component: AsignacionCompetenciasComponent;
  let fixture: ComponentFixture<AsignacionCompetenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionCompetenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionCompetenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
