import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGenericComponent } from './form-generic.component';

describe('FormDialogComponent', () => {
  let component: FormGenericComponent;
  let fixture: ComponentFixture<FormGenericComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGenericComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
