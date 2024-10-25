import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcuerdoDesempenioComponent } from './acuerdo-desempenio.component';

describe('AcuerdoDesempenioComponent', () => {
  let component: AcuerdoDesempenioComponent;
  let fixture: ComponentFixture<AcuerdoDesempenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcuerdoDesempenioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcuerdoDesempenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
