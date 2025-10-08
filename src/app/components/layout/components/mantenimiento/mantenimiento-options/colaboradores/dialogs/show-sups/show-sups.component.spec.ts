import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSupsComponent } from './show-sups.component';

describe('ShowSupsComponent', () => {
  let component: ShowSupsComponent;
  let fixture: ComponentFixture<ShowSupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowSupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowSupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
