import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionMetasComponent } from './asignacion-metas.component';

describe('AsignacionMetasComponent', () => {
  let component: AsignacionMetasComponent;
  let fixture: ComponentFixture<AsignacionMetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionMetasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
