import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubAdComponent } from './pub-ad.component';

describe('PubAdComponent', () => {
  let component: PubAdComponent;
  let fixture: ComponentFixture<PubAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
