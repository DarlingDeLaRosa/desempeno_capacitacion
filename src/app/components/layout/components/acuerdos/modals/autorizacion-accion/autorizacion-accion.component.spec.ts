import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacionAccionComponent } from './autorizacion-accion.component';

describe('AutorizacionAccionComponent', () => {
  let component: AutorizacionAccionComponent;
  let fixture: ComponentFixture<AutorizacionAccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutorizacionAccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutorizacionAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
