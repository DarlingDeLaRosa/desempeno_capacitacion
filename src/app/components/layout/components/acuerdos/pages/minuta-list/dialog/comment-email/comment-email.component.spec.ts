import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentEmailComponent } from './comment-email.component';

describe('CommentEmailComponent', () => {
  let component: CommentEmailComponent;
  let fixture: ComponentFixture<CommentEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
