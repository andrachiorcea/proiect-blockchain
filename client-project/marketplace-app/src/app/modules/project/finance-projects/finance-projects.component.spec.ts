import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceProjectsComponent } from './finance-projects.component';

describe('FinanceProjectsComponent', () => {
  let component: FinanceProjectsComponent;
  let fixture: ComponentFixture<FinanceProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
