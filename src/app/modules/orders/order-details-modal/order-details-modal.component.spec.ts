/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OrderDetailsModalComponent } from './order-details-modal.component';

describe('OrderDetailsModalComponent', () => {
  let component: OrderDetailsModalComponent;
  let fixture: ComponentFixture<OrderDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
