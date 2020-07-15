import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiappeDescriptionComponent } from './miappe-description.component';

describe('MiappeDescriptionComponent', () => {
  let component: MiappeDescriptionComponent;
  let fixture: ComponentFixture<MiappeDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiappeDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiappeDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
