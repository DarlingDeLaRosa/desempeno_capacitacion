import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscribirListaComponent } from './inscribir-lista.component';

describe('InscribirListaComponent', () => {
  let component: InscribirListaComponent;
  let fixture: ComponentFixture<InscribirListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscribirListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscribirListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
