import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoAusenciaMinutaComponent } from './motivo-ausencia-minuta.component';

describe('MotivoAusenciaMinutaComponent', () => {
  let component: MotivoAusenciaMinutaComponent;
  let fixture: ComponentFixture<MotivoAusenciaMinutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotivoAusenciaMinutaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotivoAusenciaMinutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
