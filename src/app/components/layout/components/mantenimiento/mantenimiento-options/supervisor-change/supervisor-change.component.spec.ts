import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorChangeComponent } from './supervisor-change.component';

describe('SupervisorChangeComponent', () => {
  let component: SupervisorChangeComponent;
  let fixture: ComponentFixture<SupervisorChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupervisorChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisorChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
