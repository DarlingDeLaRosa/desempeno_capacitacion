import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosMiembrosComponent } from './cursos-miembros.component';

describe('CursosMiembrosComponent', () => {
  let component: CursosMiembrosComponent;
  let fixture: ComponentFixture<CursosMiembrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosMiembrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosMiembrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
