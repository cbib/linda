import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLoginComponent } from './group-login.component';

describe('GroupLoginComponent', () => {
  let component: GroupLoginComponent;
  let fixture: ComponentFixture<GroupLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
