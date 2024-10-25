import { ComponentFixture, TestBed } from '@angular/core/testing';
import CursosTableroComponent from './cursos-tablero.component';


describe('CursosTableroComponent', () => {
  let component: CursosTableroComponent;
  let fixture: ComponentFixture<CursosTableroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosTableroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosTableroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
