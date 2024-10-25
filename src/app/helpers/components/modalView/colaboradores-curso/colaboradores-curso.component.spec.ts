import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaboradoresCursoComponent } from './colaboradores-curso.component';

describe('ColaboradoresCursoComponent', () => {
  let component: ColaboradoresCursoComponent;
  let fixture: ComponentFixture<ColaboradoresCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColaboradoresCursoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColaboradoresCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
