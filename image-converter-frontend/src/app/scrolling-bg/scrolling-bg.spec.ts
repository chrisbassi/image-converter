import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollingBg } from './scrolling-bg';

describe('ScrollingBg', () => {
  let component: ScrollingBg;
  let fixture: ComponentFixture<ScrollingBg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollingBg],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollingBg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
