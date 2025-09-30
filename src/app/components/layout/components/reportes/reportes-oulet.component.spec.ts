import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesOuletComponent } from './reportes-oulet.component';

describe('ReportesOuletComponent', () => {
  let component: ReportesOuletComponent;
  let fixture: ComponentFixture<ReportesOuletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesOuletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesOuletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
