import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagecarousselComponent } from './imagecaroussel.component';

describe('ImagecarousselComponent', () => {
  let component: ImagecarousselComponent;
  let fixture: ComponentFixture<ImagecarousselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagecarousselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagecarousselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
