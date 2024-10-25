import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiAcuerdoComponent } from './mi-acuerdo.component';

describe('MiAcuerdoComponent', () => {
  let component: MiAcuerdoComponent;
  let fixture: ComponentFixture<MiAcuerdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiAcuerdoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiAcuerdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
