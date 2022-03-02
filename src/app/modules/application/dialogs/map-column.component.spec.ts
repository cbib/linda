import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapColumnComponent } from './map-column.component';

describe('MapColumnComponent', () => {
  let component: MapColumnComponent;
  let fixture: ComponentFixture<MapColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
