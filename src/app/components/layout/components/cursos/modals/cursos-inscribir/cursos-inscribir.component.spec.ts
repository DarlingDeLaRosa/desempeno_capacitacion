import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosInscribirComponent } from './cursos-inscribir.component';

describe('CursosInscribirComponent', () => {
  let component: CursosInscribirComponent;
  let fixture: ComponentFixture<CursosInscribirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosInscribirComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosInscribirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
