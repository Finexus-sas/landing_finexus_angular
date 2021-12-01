import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorCreditComponent } from './simulator-credit.component';

describe('SimulatorCreditComponent', () => {
  let component: SimulatorCreditComponent;
  let fixture: ComponentFixture<SimulatorCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatorCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
