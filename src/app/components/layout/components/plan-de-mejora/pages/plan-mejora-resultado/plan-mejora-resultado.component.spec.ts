import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMejoraResultadoComponent } from './plan-mejora-resultado.component';

describe('PlanMejoraResultadoComponent', () => {
  let component: PlanMejoraResultadoComponent;
  let fixture: ComponentFixture<PlanMejoraResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanMejoraResultadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanMejoraResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
