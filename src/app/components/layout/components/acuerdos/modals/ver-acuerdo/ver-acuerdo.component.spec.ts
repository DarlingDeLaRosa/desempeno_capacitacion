import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAcuerdoComponent } from './ver-acuerdo.component';

describe('VerAcuerdoComponent', () => {
  let component: VerAcuerdoComponent;
  let fixture: ComponentFixture<VerAcuerdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerAcuerdoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAcuerdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
