import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultDialogComponent } from './search-result-dialog.component';

describe('SearchResultDialogComponent', () => {
  let component: SearchResultDialogComponent;
  let fixture: ComponentFixture<SearchResultDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
