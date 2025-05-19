/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RoutesDetailsModalComponent } from './routes-details-modal.component';

describe('RoutesDetailsModalComponent', () => {
  let component: RoutesDetailsModalComponent;
  let fixture: ComponentFixture<RoutesDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
