import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFilePageComponent } from './data-file-page.component';

describe('DataFilePageComponent', () => {
  let component: DataFilePageComponent;
  let fixture: ComponentFixture<DataFilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataFilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
