import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMejoraFormularioComponent } from './plan-mejora-formulario.component';

describe('PlanMejoraFormularioComponent', () => {
  let component: PlanMejoraFormularioComponent;
  let fixture: ComponentFixture<PlanMejoraFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanMejoraFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanMejoraFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
