import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlandemejoraComponent } from './plandemejora.component';

describe('PlandemejoraComponent', () => {
  let component: PlandemejoraComponent;
  let fixture: ComponentFixture<PlandemejoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlandemejoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlandemejoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
