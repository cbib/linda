import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpLoaderDialogComponent } from './help-loader-dialog.component';

describe('HelpLoaderDialogComponent', () => {
  let component: HelpLoaderDialogComponent;
  let fixture: ComponentFixture<HelpLoaderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpLoaderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpLoaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
