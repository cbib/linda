import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpLoaderComponent } from './help-loader.component';

describe('HelpLoaderDialogComponent', () => {
  let component: HelpLoaderComponent;
  let fixture: ComponentFixture<HelpLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
