import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesLoaderComponent } from './files-loader.component';

describe('FilesLoaderComponent', () => {
  let component: FilesLoaderComponent;
  let fixture: ComponentFixture<FilesLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
