import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderBoxComponent } from './loader-box.component';

describe('LoaderBoxComponent', () => {
  let component: LoaderBoxComponent;
  let fixture: ComponentFixture<LoaderBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
