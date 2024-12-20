import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutaListComponent } from './minuta-list.component';

describe('MinutaListComponent', () => {
  let component: MinutaListComponent;
  let fixture: ComponentFixture<MinutaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinutaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinutaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
