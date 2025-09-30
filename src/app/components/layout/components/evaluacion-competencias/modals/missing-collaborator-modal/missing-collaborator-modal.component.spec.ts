import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingCollaboratorModalComponent } from './missing-collaborator-modal.component';

describe('MissingCollaboratorModalComponent', () => {
  let component: MissingCollaboratorModalComponent;
  let fixture: ComponentFixture<MissingCollaboratorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingCollaboratorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingCollaboratorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
