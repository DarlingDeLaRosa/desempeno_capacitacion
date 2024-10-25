import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosListadoComponent } from './cursos-listado.component';

describe('CursosPublicacionesComponent', () => {
  let component: CursosListadoComponent;
  let fixture: ComponentFixture<CursosListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
