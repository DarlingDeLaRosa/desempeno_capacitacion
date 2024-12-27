import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMinutaComponent } from './ver-minuta.component';

describe('VerMinutaComponent', () => {
  let component: VerMinutaComponent;
  let fixture: ComponentFixture<VerMinutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerMinutaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMinutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
