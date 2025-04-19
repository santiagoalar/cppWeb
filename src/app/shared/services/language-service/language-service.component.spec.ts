/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageService } from './language-service.component';

describe('LanguageServiceComponent', () => {
  let component: LanguageService;
  let fixture: ComponentFixture<LanguageService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
