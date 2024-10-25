import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMejoraListComponent } from './plan-mejora-list.component';

describe('PlanMejoraListComponent', () => {
  let component: PlanMejoraListComponent;
  let fixture: ComponentFixture<PlanMejoraListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanMejoraListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanMejoraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
