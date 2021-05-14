import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractComponentComponent } from './extract-component.component';

describe('ExtractComponentComponent', () => {
  let component: ExtractComponentComponent;
  let fixture: ComponentFixture<ExtractComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
