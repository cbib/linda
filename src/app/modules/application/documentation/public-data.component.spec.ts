import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicDataComponent } from './public-data.component';

describe('PublicDataComponent', () => {
  let component: PublicDataComponent;
  let fixture: ComponentFixture<PublicDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
