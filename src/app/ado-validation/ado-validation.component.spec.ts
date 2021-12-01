import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoValidationComponent } from './ado-validation.component';

describe('AdoValidationComponent', () => {
  let component: AdoValidationComponent;
  let fixture: ComponentFixture<AdoValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdoValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdoValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
