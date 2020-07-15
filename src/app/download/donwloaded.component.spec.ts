import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonwloadedComponent } from './donwloaded.component';

describe('DonwloadedComponent', () => {
  let component: DonwloadedComponent;
  let fixture: ComponentFixture<DonwloadedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonwloadedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonwloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
