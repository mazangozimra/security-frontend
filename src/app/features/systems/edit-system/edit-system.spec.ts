import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSystem } from './edit-system';

describe('EditSystem', () => {
  let component: EditSystem;
  let fixture: ComponentFixture<EditSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSystem],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSystem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
