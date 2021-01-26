import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceProjectCardComponent } from './finance-project-card.component';

describe('FinanceProjectCardComponent', () => {
  let component: FinanceProjectCardComponent;
  let fixture: ComponentFixture<FinanceProjectCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceProjectCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
